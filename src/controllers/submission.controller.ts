import { ExtendedRequest } from "../libs/types/user.type";
import { Response } from "express";
import { T } from "../libs/types/common.types";
import logger from "../libs/utils/logger";
import Errors, { HttpCode, Message } from "../libs/Error";
import SubmissionService from "../service/Submission.service";
import ExamSessionService from "../service/ExamSession.service";

const submissionController: T = {};
const submissionService = new SubmissionService();
const examSessionService = new ExamSessionService();
submissionController.submitAnswer = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    logger.info("submitAnswer");
    if (!req.user?._id)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.USER_NOT_AUTHENTICATED);

    const { taskId, sessionId, content } = req.body;

    if (!taskId || !sessionId || !content)
      throw new Errors(HttpCode.BAD_REQUEST, Message.ALL_REQUIRED);

    const session = await examSessionService.getSession(sessionId);

    if (!session) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (session.status !== "active") {
      throw new Errors(HttpCode.BAD_REQUEST, Message.SESSION_IS_NOT_ACTIVE);
    }

    const { remainingTime } = await examSessionService.getRemainingTime(
      sessionId
    );
    if (remainingTime <= 0)
      throw new Errors(HttpCode.BAD_REQUEST, Message.TASK_TIME_EXPIRED);

    const result = await submissionService.submitAnswer({
      userId: req.user._id,
      taskId,
      sessionId,
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
