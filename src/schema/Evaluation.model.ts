import { Schema, Types, model } from "mongoose";

const EvaluationSchema = new Schema(
  {
    submissionId: {
      type: Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true, // 1 submission = 1 evaluation
    },

    totalScore: {
      type: Number,
      required: true,
    },

    taskUnderstanding: {
      type: Number,
      required: true,
    },

    content: {
      type: Number,
      required: true,
    },

    grammar: {
      type: Number,
      required: true,
    },

    vocabulary: {
      type: Number,
      required: true,
    },

    feedback: {
      type: String,
      required: true,
    },

    missingConcepts: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default model("Evaluation", EvaluationSchema);
