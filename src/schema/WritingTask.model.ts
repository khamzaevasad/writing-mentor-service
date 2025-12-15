import mongoose, { Schema, model } from "mongoose";
import { WritingQuestions } from "./../libs/enums/writingTask.enum";

const WritingTaskSchema = new Schema(
  {
    question: {
      type: Number,
      enum: WritingQuestions,
      required: true,
    },

    prompt: {
      type: String,
      required: true,
    },
    chartData: {
      type: Object,
      default: null,
    },
    timeLimit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WritingTask", WritingTaskSchema);
