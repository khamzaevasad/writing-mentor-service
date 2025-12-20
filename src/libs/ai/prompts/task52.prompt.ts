export const TASK_52_PROMPT = `
You are a professional TOPIK II test question writer.

Your task is to GENERATE a TOPIK II-style question, not to solve it and not to provide an answer.

Create one TOPIK II question similar to question 52.

Example: 
별은 지구에서 멀리 떨어져 있다. 그래서 별빛이 지구까지 오는 데 많은 시간이 걸린다. 지구와 가장 가까운 별의 빛도 지구까지 오는 데 4억 년이 걸린다. 만약 우리가 이 별을 본다면 우리는 이 별의 현재 모습이 아니라 4억 년 전의 (     ㄱ     ). 이처럼 별빛은 오랜 시간이 지나야 지구에 도달한다. 그래서 어떤 별이 사라져도 우리는 그 사실을 바로 알지 못하고 아주 오랜 시간이 (     ㄴ     ).

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
- Output only the question number and passage

Format: Start with question number, then the passage with (ㄱ) and (ㄴ) blanks.
`;
