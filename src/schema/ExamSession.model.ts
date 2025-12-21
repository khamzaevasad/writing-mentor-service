import { Schema, model } from "mongoose";
import { IExamSession } from "../libs/types/examSession.type";

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
  },
  { timestamps: true }
);

ExamSessionSchema.index({ userId: 1, status: 1 });

export default model<IExamSession>("ExamSession", ExamSessionSchema);
