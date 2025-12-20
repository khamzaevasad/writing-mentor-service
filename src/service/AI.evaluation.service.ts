import { Types } from "mongoose";
import EvaluationModel from "../schema/Evaluation.model";
import SubmissionService from "./Submission.service";
import Errors, { HttpCode, Message } from "../libs/Error";

class EvaluationService {
  private readonly evaluationModel;
  private readonly submission;
  constructor() {
    this.evaluationModel = EvaluationModel;
    this.submission = new SubmissionService();
  }

  public async evaluateSubmission(submissionId: string | Types.ObjectId) {
    try {
      const submission = await this.submission.findSubmitAnswer(submissionId);
      if (!submission)
        throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
      return submission;
    } catch (err) {
      throw err;
    }
  }
}

export default EvaluationService;
