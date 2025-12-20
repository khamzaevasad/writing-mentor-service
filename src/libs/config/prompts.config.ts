export const TASK_PROMPTS: Record<string, string> = {
  "51": `
You are a professional TOPIK II test question writer.
Your task is to GENERATE a TOPIK II-style question, not to solve it and not to provide an answer.
Create one TOPIK II question similar to question 51.
Example:
수미 씨, 그동안 고마웠습니다.
저는 다음 달이면 홍콩으로 일을 ( ㄱ ).
제가 원하는 회사에 취직을 해서 기뻐지만
수미 씨를 자주 못 볼 것 같아 아쉽습니다.
선물을 준비했는데 선물이 수미 씨 마음에 ( ㄴ ).
Requirements:
- Write a short personal letter or message (4-5 sentences) in Korean
- The passage must include exactly two blanks marked as (ㄱ) and (ㄴ)
- The blanks should require grammatically appropriate verb endings or expressions
- Use informal-polite speech style (합니다/해요 체)
- Topic should be personal/emotional (farewells, gratitude, apologies, invitations)
- The context should make the correct answer logically clear
- Do NOT include answer options
- Do NOT include explanations
- Output only the question number (51.) and passage with blanks.
- The passage should flow naturally like a real personal letter with clear emotional context and logical progression
- MUST use formal-polite speech style ending with -습니다/-ㅂ니다 (e.g., 갑니다, 합니다, 있습니다)
- DO NOT use informal styles like -이에요/-예요, -아요/-어요

Speech Style Rule:
✓ Correct: -습니다, -ㅂ니다, -았습니다, -겠습니다
✗ Wrong: -이에요, -예요, -아요, -어요, -해요
  `.trim(),

  "52": `
You are a professional TOPIK II test question writer.
Your task is to GENERATE a TOPIK II-style question, not to solve it and not to provide an answer.
Create one TOPIK II question similar to question 52.
Example:
별은 지구에서 멀리 떨어져 있다. 그래서 별빛이 지구까지 오는 데 많은 시간이 걸린다. 지구와 가장 가까운 별의 빛도 지구까지 오는 데 4억 년이 걸린다. 만약 우리가 이 별을 본다면 우리는 이 별의 현재 모습이 아니라 4억 년 전의 ( ㄱ ). 이처럼 별빛은 오랜 시간이 지나야 지구에 도달한다. 그래서 어떤 별이 사라져도 우리는 그 사실을 바로 알지 못하고 아주 오랜 시간이 ( ㄴ ).
Requirements:
- Write an informative/explanatory passage (5-7 sentences) in Korean
- The passage must include exactly two blanks marked as (ㄱ) and (ㄴ)
- Use formal written style (다/이다 ending)
- Topic should be academic, scientific, cultural, or social phenomena
- The blanks should require noun phrases or complete clauses that fit logically
- Include cause-and-effect or explanatory structure
- The context should clearly indicate what type of content fits each blank
- Do NOT include answer options
- Do NOT include explanations
- Output only the question number (52.) and passage with blanks.
  `.trim(),

  "53": `
You are a professional TOPIK II test question writer.
Your task is to GENERATE a TOPIK II-style question 53, including a fictional chart/graph description.
Create a complete question 53 with:
- A realistic bar chart, line chart, or table about social/economic/educational trends (e.g., online shopping, reading habits, smartphone usage)
- Years or categories on X-axis, values on Y-axis
- Question text in Korean describing the chart
- Writing instruction: 다음을 참고하여 '~ 변화' 또는 '~ 현황'에 대한 내용을 200~300자로 쓰십시오. 단, 글의 제목은 쓰지 마십시오.
Requirements:
- Output in strict JSON format (no extra text):
{
  "questionNumber": "53.",
  "prompt": "Full Korean question text including chart description and instruction",
  "chartData": {
    "type": "bar" | "line" | "pie",
    "title": "Chart title in Korean",
    "data": { /* simple object for frontend to render, e.g., { "2014": 46, "2018": 92 } or array */ }
  }
}
- Make it look exactly like real TOPIK 53 (200-300자, describe trends)
- Chart data must be realistic and varied
`.trim(),

  "54": `You are a professional TOPIK II writing exam question designer.

Your task is to GENERATE a TOPIK II Question 54 writing task, not to write a model answer and not to solve it.

Requirements:
- Present a clear topic related to society, culture, education, technology, or daily life.
- Provide specific conditions or guiding points that the examinee must address.
- The question must require a response of approximately 600–700 Korean characters.
- The difficulty level must match real TOPIK II Question 54.
- Do NOT include a sample answer.
- Do NOT include explanations or tips.
- Output only the question text.

The result should look exactly like an actual TOPIK II Question 54.
`.trim(),
};
