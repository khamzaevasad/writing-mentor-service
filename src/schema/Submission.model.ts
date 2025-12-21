import mongoose, { Schema, Types } from "mongoose";

const SubmissionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: Types.ObjectId,
      ref: "WritingTask",
      required: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "ExamSession",
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

SubmissionSchema.index({ taskId: 1, sessionId: 1 }, { unique: true });

export default mongoose.model("Submission", SubmissionSchema);
