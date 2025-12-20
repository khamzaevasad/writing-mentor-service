import { ExtendedRequest } from "../libs/types/user.type";
import { Response } from "express";
import { T } from "../libs/types/common.types";
import logger from "../libs/utils/logger";
import Errors, { HttpCode, Message } from "../libs/Error";
import SubmissionService from "../service/Submission.service";

const submissionController: T = {};
const submissionService = new SubmissionService();

submissionController.submitAnswer = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    logger.info("submitAnswer");
    if (!req.user?._id)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.USER_NOT_AUTHENTICATED);

    const { taskId, content } = req.body;

    if (!taskId || !content)
      throw new Errors(HttpCode.BAD_REQUEST, Message.ALL_REQUIRED);

    const result = await submissionService.submitAnswer({
      userId: req.user._id,
      taskId,
      content,
    });
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    logger.error("submitAnswer", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default submissionController;
