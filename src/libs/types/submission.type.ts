import { ObjectId, Types } from "mongoose";
import { Questions } from "../enums/writingTask.enum";

export interface Submission {
  _id: ObjectId;
  userId: ObjectId;
  taskId: ObjectId;
  content: string;
  submittedAt: Date;
}

export interface SubmissionInput {
  questionType: Questions;
  questionText: string;
  userAnswer: string;
  timeSpend: number;
}

export interface BlankAnswerInput {
  answers: {
    ㄱ: string;
    ㄴ: string;
  };
}

export interface SubmitBlankAnswerRequest {
  userId: Types.ObjectId | string;
  taskId: Types.ObjectId | string;
  content: BlankAnswerInput | string;
}
