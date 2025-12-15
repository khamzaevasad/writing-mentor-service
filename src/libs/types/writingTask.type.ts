import { ObjectId } from "mongoose";
import { Questions } from "./../enums/writingTask.enum";

export interface WritingQuestion {
  questions: Questions;
}

export interface ChartData {
  type: "bar" | "line" | "pie";
  labels: string[];
  values: number[];
  title: string;
}

export interface WritingTask {
  _id: ObjectId;
  questions: WritingQuestion;
  userId: ObjectId;
  prompt: string;
  chartData?: ChartData;
  timeLimit: number;
  createdAt: Date;
  updatedAt: Date;
}
