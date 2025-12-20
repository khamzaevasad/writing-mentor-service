import OpenAI from "openai";
import { TASK_PROMPTS } from "../libs/config/prompts/prompts.config";
import Errors, { HttpCode, Message } from "../libs/Error";
import { Questions } from "../libs/enums/writingTask.enum";

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
  ): Promise<String | {}> {
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
      });

      const content = completion.choices[0].message.content?.trim();

      if (questionType === Questions.FIFTY_THREE) {
        try {
          return JSON.parse(content || "{}");
        } catch {
          return { prompt: content, chartData: null };
        }
      }

      return content || Message.TASK_GENERATION_FAILED;
    } catch (err) {
      console.error("Error: model: AItaskService", err);
      throw new Errors(HttpCode.NOT_MODIFIED, Message.TASK_GENERATION_FAILED);
    }
  }
}

export default AItaskService;
