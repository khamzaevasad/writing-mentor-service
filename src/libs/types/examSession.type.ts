import { Types } from "mongoose";

export interface IExamSession {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  taskIds: Types.ObjectId[];
  startTime: Date;
  endTime?: Date;
  timeLimit: number;
  status: "active" | "completed" | "expired";
  createdAt: Date;
  updatedAt: Date;
}
