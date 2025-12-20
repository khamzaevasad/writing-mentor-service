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
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
