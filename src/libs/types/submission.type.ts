import { ObjectId, Types } from "mongoose";
import { Questions } from "../enums/writingTask.enum";
import { IWritingTask } from "./writingTask.type";

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

export interface ISubmission51_52 {
  _id: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  taskId: string | Types.ObjectId;
  content: BlankAnswerInput;
  writingTask: IWritingTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubmission53_54 {
  _id: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  taskId: string | Types.ObjectId;
  content: {
    answer: string;
  };
  writingTask: IWritingTask[];
  createdAt: Date;
  updatedAt: Date;
}

export type ISubmission = ISubmission51_52 | ISubmission53_54;

// HELPER TYPE GUARDS
export function isSubmission51_52(
  submission: ISubmission
): submission is ISubmission51_52 {
  return (
    "answer" in submission.content &&
    typeof submission.content.answer === "object" &&
    "ㄱ" in submission.content.answer &&
    "ㄴ" in submission.content.answer
  );
}

export function isSubmission53_54(
  submission: ISubmission
): submission is ISubmission53_54 {
  return (
    "answer" in submission.content &&
    typeof submission.content.answer === "string"
  );
}
