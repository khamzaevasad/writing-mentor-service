import mongoose, { Schema, Types } from "mongoose";

const SubmissionSchema = new Schema(
  {
    userId: {
      types: Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      types: Types.ObjectId,
      ref: "WritingTask",
      required: true,
    },
    content: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
