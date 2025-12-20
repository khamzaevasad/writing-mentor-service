import mongoose, { Schema, Document } from "mongoose";
import { WritingQuestions } from "./../libs/enums/writingTask.enum";
import { IWritingTask } from "../libs/types/writingTask.type";

const ChartDataSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["bar", "line", "pie"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

const WritingTaskSchema = new Schema<IWritingTask>(
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
      type: ChartDataSchema,
      default: null,
      required: false,
    },
    timeLimit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, collection: "writingTask" }
);

export default mongoose.model("WritingTask", WritingTaskSchema);
