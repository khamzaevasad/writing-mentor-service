import { ExtendedRequest } from "../libs/types/user.type";
import { Response } from "express";
import { T } from "../libs/types/common.types";
import logger from "../libs/utils/logger";
import Errors, { HttpCode } from "../libs/Error";
import AIservice from "../service/Ai.service";

const evaluationController: T = {};
const aiService = new AIservice();
evaluationController.generateWritingTask = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    logger.info("generateWritingTask");
    const task: string = req.body;
    const result = await aiService.generateWritingTask(task);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    logger.error("generateWritingTask", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default evaluationController;
