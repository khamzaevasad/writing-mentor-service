import { Schema, model } from "mongoose";
import { IExamSession } from "../libs/types/examSession.type";

const SessionResultSchema = new Schema(
  {
    totalScore: { type: Number, required: true },
    breakdown: {
      question51: {
        score: { type: Number, required: true },
        maxScore: { type: Number, default: 10 },
        percentage: { type: Number, required: true },
      },
      question52: {
        score: { type: Number, required: true },
        maxScore: { type: Number, default: 10 },
        percentage: { type: Number, required: true },
      },
      question53: {
        score: { type: Number, required: true },
        maxScore: { type: Number, default: 30 },
        percentage: { type: Number, required: true },
      },
      question54: {
        score: { type: Number, required: true },
        maxScore: { type: Number, default: 50 },
        percentage: { type: Number, required: true },
      },
    },
    evaluationIds: [{ type: Schema.Types.ObjectId, ref: "Evaluation" }],
    overallFeedback: { type: String, required: true },
    evaluatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ExamSessionSchema = new Schema<IExamSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "WritingTask",
        required: true,
      },
    ],
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    timeLimit: {
      type: Number,
      required: true,
      default: 50 * 60 * 1000,
    },
    status: {
      type: String,
      enum: ["active", "completed", "expired"],
      default: "active",
    },
    result: {
      type: SessionResultSchema,
      required: false,
    },
  },
  { timestamps: true }
);

ExamSessionSchema.index({ userId: 1, status: 1 });

export default model<IExamSession>("ExamSession", ExamSessionSchema);
