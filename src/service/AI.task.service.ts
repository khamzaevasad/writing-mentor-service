import OpenAI from "openai";
import { TASK_PROMPTS } from "../libs/config/prompts/prompts.config";
import Errors, { HttpCode, Message } from "../libs/Error";
import { Questions } from "../libs/enums/writingTask.enum";
import { AIGeneratedTask } from "../libs/types/ai.types";
import logger from "../libs/utils/logger";

class AItaskService {
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
      logger.error("Error: model: AItaskService", err);
      throw new Errors(HttpCode.NOT_MODIFIED, Message.TASK_GENERATION_FAILED);
    }
  }

  //
}

export default AItaskService;
