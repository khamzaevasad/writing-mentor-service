import { ObjectId } from "mongoose";

export interface Submission {
  _id: ObjectId;
  userId: ObjectId;
  taskId: ObjectId;
  content: string;
  submittedAt: Date;
}
