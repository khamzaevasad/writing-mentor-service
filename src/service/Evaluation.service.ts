import { Types } from "mongoose";
import EvaluationModel from "../schema/Evaluation.model";
import SubmissionService from "./Submission.service";
import Errors, { HttpCode, Message } from "../libs/Error";
import {
  Evaluation51_52_Input,
  Evaluation53_Input,
  Evaluation54_Input,
  EvaluationInput,
} from "../libs/types/evaluation.type";
import logger from "../libs/utils/logger";
import AIService from "./AI.service";

class EvaluationService {
  private readonly evaluationModel;
  private readonly submission;
  private readonly aiService;
  constructor() {
    this.evaluationModel = EvaluationModel;
    this.submission = new SubmissionService();
    this.aiService = new AIService();
  }

  public async evaluateSubmission(submissionId: string | Types.ObjectId) {
    try {
      const submission = await this.submission.findSubmitAnswer(submissionId);
      if (!submission)
        throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      const submissionData = submission[0];

      if (
        !submissionData.writingTask ||
        submissionData.writingTask.length === 0
      )
        throw new Errors(HttpCode.NOT_FOUND, Message.TASK_NOT_FOUND);

      const task = submissionData.writingTask[0];
      const questionNumber = task.question;

      let evaluationInput: EvaluationInput;

      if (questionNumber === 51 || questionNumber === 52) {
        const userAnswer = submissionData.content.answer as {
          ㄱ: string;
          ㄴ: string;
        };

        evaluationInput = {
          submissionId: submissionData._id.toString(),
          taskId: task._id.toString(),
          questionNumber: questionNumber,
          originalPrompt: task.prompt,
          userAnswerBlank1: userAnswer.ㄱ,
          userAnswerBlank2: userAnswer.ㄴ,
        } as Evaluation51_52_Input;

        console.log("📝 51/52 input prepared", evaluationInput);
      } else if (questionNumber === 53) {
        const userAnswer = submissionData.content as string;

        if (!task.chartData) {
          throw new Errors(HttpCode.BAD_REQUEST, Message.CHART_NOT_FOUND);
        }

        evaluationInput = {
          submissionId: submissionData._id.toString(),
          taskId: task._id.toString(),
          questionNumber: 53,
          originalPrompt: task.prompt,
          chartData: task.chartData,
          userAnswer: userAnswer,
        } as Evaluation53_Input;

        console.log("📊 53 Input prepared:", evaluationInput);
      } else if (questionNumber === 54) {
        const userAnswer = submissionData.content as string;

        evaluationInput = {
          submissionId: submissionData._id.toString(),
          taskId: task._id.toString(),
          questionNumber: 54,
          originalPrompt: task.prompt,
          userAnswer: userAnswer,
        } as Evaluation54_Input;
        console.log("✍️ 54 Input prepared:", evaluationInput);
      } else {
        throw new Errors(
          HttpCode.BAD_REQUEST,
          Message.UNSUPPORTED_QUESTION_TYPE
        );
      }
      logger.info("🤖 Ready to call AI with input");
      logger.info("🤖 Calling AI for evaluation...");
      const aiResult = await this.aiService.evaluateSubmission(evaluationInput);
      console.log("✅ AI evaluation completed:", aiResult);

      const evaluationData = {
        submissionId: new Types.ObjectId(submissionData._id),
        totalScore: aiResult.totalScore,
        feedback: aiResult.feedback,
        missingConcepts: aiResult.missingConcepts,

        ...(questionNumber === 51 || questionNumber === 52
          ? {
              blank1Score: (aiResult as any).blank1Score,
              blank2Score: (aiResult as any).blank2Score,
            }
          : {}),

        ...(questionNumber === 53 || questionNumber === 54
          ? {
              taskUnderstanding: (aiResult as any).taskUnderstanding,
              content: (aiResult as any).content,
              grammar: (aiResult as any).grammar,
              vocabulary: (aiResult as any).vocabulary,
            }
          : {}),
      };

      const savedEvaluation = await this.evaluationModel.create(evaluationData);
      console.log("💾 Evaluation saved to database:", savedEvaluation._id);

      if (!savedEvaluation)
        throw new Errors(HttpCode.NOT_MODIFIED, Message.CREATION_FAILED);
      return savedEvaluation;
    } catch (err) {
      throw err;
    }
  }
}

export default EvaluationService;
