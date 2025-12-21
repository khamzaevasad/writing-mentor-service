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

    blank1Score: {
      type: Number,
      required: false,
    },

    blank2Score: {
      type: Number,
      required: false,
    },

    taskUnderstanding: {
      type: Number,
      required: false,
    },

    content: {
      type: Number,
      required: false,
    },

    grammar: {
      type: Number,
      required: false,
    },

    vocabulary: {
      type: Number,
      required: false,
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
