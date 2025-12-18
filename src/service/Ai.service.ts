import OpenAI from "openai";

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

  public async generateWritingTask(questionType: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Sen TOPIK imtihoniga tayyorlaydigan tajribali koreys tili o'qituvchisisan. Javobni faqat koreys tilida ber va hech qanday qo'shimcha izoh yozma.",
          },
          {
            role: "user",
            content: `TOPIK ${questionType} turidagi 쓰기 savoliga o'xshash, lekin mutlaqo noyob va hech qayerda uchramagan savol yarating. Diagrammasiz bo'lsin. Faqat savol matnini koreys tilida yozing, boshqa hech narsa qo'shmang.`,
          },
        ],
        temperature: 0.9,
        max_tokens: 600,
      });

      return (
        completion.choices[0].message.content?.trim() ||
        "Savol generatsiya qilishda xato yuz berdi."
      );
    } catch (error: any) {
      console.error("[AI Service] Xato:", error.message);
      throw new Error(`OpenAI xatosi: ${error.message}`);
    }
  }
}

export default AIservice;
