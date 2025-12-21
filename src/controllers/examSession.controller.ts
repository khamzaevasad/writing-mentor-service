import { ExtendedRequest } from "../libs/types/user.type";
import { T } from "../libs/types/common.types";
import ExamSessionService from "../service/ExamSession.service";
import { Response } from "express";
import logger from "../libs/utils/logger";
import Errors, { HttpCode } from "../libs/Error";

const examSessionService = new ExamSessionService();

const examSessionController: T = {};

examSessionController.startExamSession = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    logger.info("startExamSession");
    const userId = req.user._id;
    const result = await examSessionService.startExamSession(userId);
    res
      .status(HttpCode.OK)
      .json({ success: true, message: "Exam session started", data: result });
  } catch (err) {
    logger.error("evaluateSubmission", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

examSessionController.getRemainingTime = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    logger.info("getRemainingTime");
    const { sessionId } = req.params;
    const result = await examSessionService.getRemainingTime(sessionId);
    res.status(HttpCode.OK).json({ success: true, data: result });
  } catch (err) {
    logger.error("getRemainingTime", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

examSessionController.completeSession = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    logger.info("completeSession");
    const { sessionId } = req.params;
    const result = await examSessionService.completeSession(sessionId);
    res
      .status(HttpCode.OK)
      .json({ success: true, message: "Exam completed", data: result });
  } catch (err) {
    logger.error("completeSession", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
export default examSessionController;
