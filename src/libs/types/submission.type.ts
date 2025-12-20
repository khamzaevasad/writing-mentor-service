import { ObjectId, Types } from "mongoose";
import { Questions } from "../enums/writingTask.enum";

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
  userId?: Types.ObjectId | string;
  taskId: Types.ObjectId | string;
  content: BlankAnswerInput | string;
}

export interface Submission {
  _id: ObjectId | string;
  userId: ObjectId | string;
  taskId: ObjectId | string;
  content: SubmitBlankAnswerRequest;
  createdAt: Date;
  updatedAt: Date;
}
