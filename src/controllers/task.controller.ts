import { ExtendedRequest } from "../libs/types/user.type";
import { Response } from "express";
import { T } from "../libs/types/common.types";
import logger from "../libs/utils/logger";
import Errors, { HttpCode } from "../libs/Error";
import AIservice from "../service/AI.service";
import { Questions } from "../libs/enums/writingTask.enum";

const taskController: T = {};
const aiService = new AIservice();
taskController.generateWritingTask = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    logger.info("generateWritingTask");
    const result = await aiService.generateWritingTask(Questions.FIFTY_TWO);
    res.status(HttpCode.OK).json({ question: result });
  } catch (err) {
    logger.error("generateWritingTask", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default taskController;
