import OpenAI from "openai";
import { TASK_PROMPTS } from "../libs/config/prompts/prompts.config";
import Errors, { HttpCode, Message } from "../libs/Error";
import { Questions } from "../libs/enums/writingTask.enum";
import { AIGeneratedTask } from "../libs/types/ai.types";
import logger from "../libs/utils/logger";
import {
  Evaluation51_52_Input,
  Evaluation53_Input,
  Evaluation54_Input,
  EvaluationInput,
  EvaluationOutput,
} from "../libs/types/evaluation.type";
import { EVALUATION_PROMPTS } from "../libs/config/prompts/evaluation.prompt";

class AIService {
  private readonly openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Errors(HttpCode.NOT_FOUND, Message.KEY_NOT_FOUND);
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // generateWritingTask
  public async generateWritingTask(
    questionType: Questions
  ): Promise<AIGeneratedTask> {
    const prompt = TASK_PROMPTS[questionType];

    if (!prompt) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.UNSUPPORTED_QUESTION_TYPE);
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: questionType === Questions.FIFTY_THREE ? 800 : 600,

        ...(questionType === Questions.FIFTY_THREE && {
          response_format: { type: "json_object" },
        }),
      });

      const content = completion.choices[0].message.content?.trim();
      if (!content) {
        throw new Errors(HttpCode.NOT_MODIFIED, Message.TASK_GENERATION_FAILED);
      }

      if (questionType === Questions.FIFTY_THREE) {
        try {
          const parsed = JSON.parse(content);

          if (!parsed.chartData) {
            throw new Error("chartData not found in response");
          }
          return {
            type: "CHART",
            prompt: parsed.prompt,
            chartData: parsed.chartData,
          };
        } catch (parseError) {
          logger.error("JSON parse error:", parseError);
          logger.error("Received content:", content);

          throw new Errors(
            HttpCode.INTERNAL_SERVER_ERROR,
            Message.PARSE_FAILED
          );
        }
      }

      return {
        type: "SIMPLE",
        prompt: content,
      };
    } catch (err) {
      logger.error("Error: model: AIService", err);
      throw new Errors(HttpCode.NOT_MODIFIED, Message.TASK_GENERATION_FAILED);
    }
  }

  // evaluateSubmission
  public async evaluateSubmission(
    input: EvaluationInput
  ): Promise<EvaluationOutput> {
    try {
      const { questionNumber } = input;

      const prompt = EVALUATION_PROMPTS[questionNumber];
      if (!prompt) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.PROMPT_NOT_FOUND);
      }

      let userContent: any;

      if (questionNumber === 51 || questionNumber === 52) {
        const typedInput = input as Evaluation51_52_Input;
        userContent = {
          submissionId: typedInput.submissionId,
          originalPrompt: typedInput.originalPrompt,
          userAnswerBlank1: typedInput.userAnswerBlank1,
          userAnswerBlank2: typedInput.userAnswerBlank2,
        };
      } else if (questionNumber === 53) {
        const typedInput = input as Evaluation53_Input;
        userContent = {
          submissionId: input.submissionId,
          originalPrompt: input.originalPrompt,
          chartData: input.chartData,
          userAnswer: input.userAnswer,
        };
      } else if (questionNumber === 54) {
        const typedInput = input as Evaluation54_Input;
        userContent = {
          submissionId: input.submissionId,
          originalPrompt: input.originalPrompt,
          userAnswer: input.userAnswer,
        };
      }

      logger.info(`🤖 Calling OpenAI for Q${questionNumber} evaluation`);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: JSON.stringify(userContent) },
        ],
        temperature: questionNumber === 51 || questionNumber === 52 ? 0.2 : 0.3,
        response_format: { type: "json_object" },
        max_tokens: questionNumber === 54 ? 1500 : 1000,
      });

      const result = completion.choices[0].message.content?.trim();
      if (!result) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.OPEN_AI_ERR);
      }

      const evaluationResult = JSON.parse(result) as EvaluationOutput;
      logger.info(
        `✅ AI evaluation completed for submission ${input.submissionId}`
      );

      return evaluationResult;
    } catch (err) {
      logger.error("Error model:evaluateSubmission", err);
      if (err instanceof Errors) throw err;
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.OPEN_AI_ERR);
    }
  }
  // generateOverallFeedback
  public async generateOverallFeedback(
    evaluations: Array<{
      question: number;
      score: number;
      feedback: string;
      missingConcepts: string[];
    }>
  ): Promise<string> {
    try {
      logger.info("🤖 Generating overall feedback from AI...");

      // Prompt yaratish
      const prompt = `
You are a TOPIK II writing exam evaluator. Based on the individual question evaluations below, provide a comprehensive overall feedback in Korean.

Evaluation Results:
${JSON.stringify(evaluations, null, 2)}

Requirements:
- Write feedback in Korean (한국어)
- Keep it concise (150-200 characters)
- Highlight overall strengths
- Identify main areas for improvement
- Be constructive and encouraging
- Mention specific concepts that need work

Format:
전반적으로 [overall assessment]. 강점은 [strengths]. 개선이 필요한 부분은 [areas to improve]. 특히 [specific concepts]을/를 더 연습하시기 바랍니다.
      `.trim();

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a professional TOPIK II evaluator providing overall feedback.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 500,
      });

      const result = completion.choices[0].message.content?.trim();

      if (!result) {
        throw new Error("Failed to generate overall feedback");
      }

      logger.info("✅ Overall feedback generated");
      return result;
    } catch (err) {
      logger.error("Error generating overall feedback:", err);

      // ✅ Fallback: AI fail bo'lsa, manual summary
      return this.createFallbackFeedback(evaluations);
    }
  }

  // createFallbackFeedback
  private createFallbackFeedback(
    evaluations: Array<{
      question: number;
      score: number;
      feedback: string;
      missingConcepts: string[];
    }>
  ): string {
    const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0);
    const maxScore = 100; // 10 + 10 + 30 + 50
    const percentage = Math.round((totalScore / maxScore) * 100);

    // Kamchiliklar yig'ish
    const allMissingConcepts = evaluations
      .flatMap((e) => e.missingConcepts)
      .filter((concept, index, self) => self.indexOf(concept) === index) // unique
      .slice(0, 3); // faqat birinchi 3ta

    let feedback = `전반적으로 ${percentage}%의 점수를 획득하셨습니다. `;

    if (percentage >= 80) {
      feedback += "우수한 성적입니다. ";
    } else if (percentage >= 60) {
      feedback += "양호한 수준입니다. ";
    } else {
      feedback += "더 많은 연습이 필요합니다. ";
    }

    if (allMissingConcepts.length > 0) {
      feedback += `특히 ${allMissingConcepts.join(
        ", "
      )}을/를 더 학습하시기 바랍니다.`;
    }

    return feedback;
  }
}

export default AIService;
