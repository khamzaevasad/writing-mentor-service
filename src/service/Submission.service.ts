import { Types } from "mongoose";
import { SubmitBlankAnswerRequest } from "../libs/types/submission.type";
import SubmissionModel from "../schema/Submission.model";
import Errors, { HttpCode, Message } from "../libs/Error";

class SubmissionService {
  private readonly submissionModel;

  constructor() {
    this.submissionModel = SubmissionModel;
  }

  //   submitAnswer
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

  //   findSubmitAnswer
  public async findSubmitAnswer(id: string | Types.ObjectId) {
    try {
      const result = await this.submissionModel.aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: "writingTask",
            localField: "taskId",
            foreignField: "_id",
            as: "writingTask",
          },
        },
      ]);

      console.log("submission aggregate result", result);
      if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
      return result;
    } catch (err) {
      console.log("Error model: findSubmitAnswer", err);
      throw err;
    }
  }
}

export default SubmissionService;
