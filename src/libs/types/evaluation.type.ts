import { ObjectId } from "mongoose";
import { IChartData } from "./writingTask.type";

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

export interface BaseEvaluationInput {
  submissionId: string;
  taskId: string;
  questionNumber: 51 | 52 | 53 | 54;
}

export interface Evaluation51_52_Input extends BaseEvaluationInput {
  questionNumber: 51 | 52;
  originalPrompt: string;
  userAnswerBlank1: string; // ㄱ
  userAnswerBlank2: string; // ㄴ
}

export interface Evaluation53_Input extends BaseEvaluationInput {
  questionNumber: 53;
  originalPrompt: string;
  chartData: IChartData;
  userAnswer: string; // Full essay
}

export interface Evaluation54_Input extends BaseEvaluationInput {
  questionNumber: 54;
  originalPrompt: string;
  userAnswer: string; // Full essay
}

export type EvaluationInput =
  | Evaluation51_52_Input
  | Evaluation53_Input
  | Evaluation54_Input;

export interface BaseEvaluationOutput {
  submissionId: string;
  totalScore: number;
  feedback: string;
  missingConcepts: string[];
  createdAt?: Date;
}

export interface Evaluation51_52_Output extends BaseEvaluationOutput {
  totalScore: number; // 0-10
  blank1Score: number; // 0-5
  blank2Score: number; // 0-5
}

export interface Evaluation53_Output extends BaseEvaluationOutput {
  totalScore: number; // 0-30
  taskUnderstanding: number; // 0-7
  content: number; // 0-7
  grammar: number; // 0-16
  vocabulary: number; // 0-16
}

export interface Evaluation54_Output extends BaseEvaluationOutput {
  totalScore: number; // 0-50
  taskUnderstanding: number; // 0-12
  content: number; // 0-12
  grammar: number; // 0-26
  vocabulary: number; // 0-26
}

export type EvaluationOutput =
  | Evaluation51_52_Output
  | Evaluation53_Output
  | Evaluation54_Output;
