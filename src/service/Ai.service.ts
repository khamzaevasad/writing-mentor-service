import OpenAI from "openai";
import { TASK_PROMPTS } from "../libs/config/prompts.config";

class AIservice {
  private readonly openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY topilmadi .env faylda");
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  public async generateWritingTask(questionType: string): Promise<any> {
    // return any yoki interface yarating
    const prompt = TASK_PROMPTS[questionType];

    if (!prompt) {
      throw new Error(`Noto'g'ri questionType: ${questionType}`);
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o", // yoki gpt-4o-mini arzonroq uchun
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8, // kreativlik uchun
        max_tokens: questionType === "53" ? 800 : 600,
      });

      const content = completion.choices[0].message.content?.trim();

      if (questionType === "53") {
        // JSON qaytarishini parse qilamiz
        try {
          return JSON.parse(content || "{}");
        } catch {
          return { prompt: content, chartData: null }; // agar parse bo'lmasa
        }
      }

      return content || "Savol generatsiya qilishda xato yuz berdi.";
    } catch (error: any) {
      console.error("[AI Service] Xato:", error.message);
      throw new Error(`OpenAI xatosi: ${error.message}`);
    }
  }
}

export default AIservice;
