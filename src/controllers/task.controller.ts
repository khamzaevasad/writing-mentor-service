import { ExtendedRequest } from "../libs/types/user.type";
import { Response } from "express";
import { T } from "../libs/types/common.types";
import logger from "../libs/utils/logger";
import Errors, { HttpCode } from "../libs/Error";
import { Questions, WritingQuestions } from "../libs/enums/writingTask.enum";
import AItaskService from "../service/AI.task.service";
import WritingTaskService from "../service/WritingTask.service";

const taskController: T = {};
const aiService = new AItaskService();
const writingTaskService = new WritingTaskService();

// generateWritingTask
taskController.generateWritingTask = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    logger.info("generateWritingTask");

    const question = req.params.question as string;
    console.log("question", question);
    const questionType = Number(question);
    const result = await aiService.generateWritingTask(questionType);

    let prompt: string;
    let chartData: object | null = null;

    if (result.type === "CHART") {
      prompt = result.prompt;
      chartData = result.chartData;
    } else {
      prompt = result.prompt;
    }

    const input = {
      question: questionType,
      prompt: prompt,
      chartData: chartData,
      timeLimit: questionType === Questions.FIFTY_FOUR.valueOf() ? 70 : 30,
    };

    const savedTask = await writingTaskService.createTask(input);

    res.status(HttpCode.OK).json(savedTask);
  } catch (err) {
    logger.error("generateWritingTask", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default taskController;
