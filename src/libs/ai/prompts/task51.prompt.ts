export const TASK_51_PROMPT = `
You are a professional TOPIK II test question writer.

Your task is to GENERATE a TOPIK II-style question, not to solve it and not to provide an answer.

Create one TOPIK II question similar to question 51.

Example: 
수미 씨, 그동안 고마웠습니다.
저는 다음 달이면 홍콩으로 일을 (     ㄱ     ).
제가 원하는 회사에 취직을 해서 기뻐지만
수미 씨를 자주 못 볼 것 같아 아쉽습니다.
선물을 준비했는데 선물이 수미 씨 마음에 (     ㄴ     ).

Requirements:
- Write a short personal letter or message (4-5 sentences) in Korean
- The passage must include exactly two blanks marked as (ㄱ) and (ㄴ)
- The blanks should require grammatically appropriate verb endings or expressions
- Use informal-polite speech style (합니다/해요 체)
- Topic should be personal/emotional (farewells, gratitude, apologies, invitations)
- The context should make the correct answer logically clear
- Do NOT include answer options
- Do NOT include explanations
- Output only the question number and passage

Format: Start with question number, then the passage with (ㄱ) and (ㄴ) blanks.
`;
