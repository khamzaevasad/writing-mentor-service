import { Types } from "mongoose";
import {
  BlankAnswerInput,
  SubmitBlankAnswerRequest,
} from "../libs/types/submission.type";
import SubmissionModel from "../schema/Submission.model";
import Errors, { HttpCode, Message } from "../libs/Error";

class SubmissionService {
  private readonly submissionModel;

  constructor() {
    this.submissionModel = SubmissionModel;
  }

  public async submitAnswer(input: SubmitBlankAnswerRequest) {
    try {
      const result = await this.submissionModel.create(input);
      if (!result)
        throw new Errors(HttpCode.NOT_MODIFIED, Message.SUBMISSION_FAILED);
      return result;
    } catch (err) {
      console.log("Error submitAnswer", err);
      throw err;
    }
  }
}

export default SubmissionService;
