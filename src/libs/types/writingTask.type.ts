import { ObjectId, Document } from "mongoose";
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

export interface IChartData {
  type: "bar" | "line" | "pie";
  title: string;
  data: Record<string, any>;
}

export interface IWritingTask extends Document {
  question: 51 | 52 | 53 | 54;
  prompt: string;
  chartData?: IChartData | null;
  timeLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWritingTaskInput {
  question: Questions;
  prompt: string;
  chartData?: IChartData | null;
  timeLimit: number;
}

export interface UpdateWritingTaskInput {
  prompt?: string;
  chartData?: IChartData | null;
  timeLimit?: number;
}
