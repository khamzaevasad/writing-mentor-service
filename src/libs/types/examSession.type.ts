import { Types } from "mongoose";

export interface ISessionResult {
  totalScore: number; // 0-100
  breakdown: {
    question51: { score: number; maxScore: 10; percentage: number };
    question52: { score: number; maxScore: 10; percentage: number };
    question53: { score: number; maxScore: 30; percentage: number };
    question54: { score: number; maxScore: 50; percentage: number };
  };
  evaluationIds: Types.ObjectId[];
  overallFeedback: string;
  evaluatedAt: Date;
}

export interface IExamSession {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  taskIds: Types.ObjectId[];
  startTime: Date;
  endTime?: Date;
  timeLimit: number;
  status: "active" | "completed" | "expired";
  result?: ISessionResult;
  createdAt: Date;
  updatedAt: Date;
}
