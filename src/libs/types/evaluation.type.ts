import { ObjectId } from "mongoose";

export interface Evaluation {
  _id: ObjectId;
  submissionId: ObjectId;
  totalScore: number;
  taskUnderStanding: number;
  content: number;
  grammar: number;
  vocabulary: number;
  feedback: string;
  missingConcepts: string[];
}
