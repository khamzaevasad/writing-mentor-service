export enum Questions {
  FIFTY_ONE = 51,
  FIFTY_TWO = 52,
  FIFTY_THREE = 53,
  FIFTY_FOUR = 54,
}

export const WritingQuestions = [51, 52, 53, 54] as const;
type WritingQuestion = (typeof WritingQuestions)[number];
