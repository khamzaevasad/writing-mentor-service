import { ExtendedRequest } from "../libs/types/user.type";
import { Response } from "express";
import { T } from "../libs/types/common.types";
import logger from "../libs/utils/logger";
import Errors, { HttpCode, Message } from "../libs/Error";
import EvaluationService from "../service/AI.evaluation.service";

const evaluationController: T = {};
const evaluationService = new EvaluationService();
// evaluateSubmission
evaluationController.evaluateSubmission = async (
  req: ExtendedRequest,
  res: Response
) => {
  logger.info("evaluateSubmission");

  const { submissionId } = req.body;

  if (!submissionId)
    throw new Errors(HttpCode.BAD_REQUEST, Message.ALL_REQUIRED);

  const result = await evaluationService.evaluateSubmission(submissionId);
  res.status(HttpCode.OK).json(result);
  try {
  } catch (err) {
    logger.error("evaluateSubmission", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default evaluationController;
