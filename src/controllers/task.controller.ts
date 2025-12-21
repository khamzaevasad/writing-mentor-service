import { ExtendedRequest } from "../libs/types/user.type";
import { Response } from "express";
import { T } from "../libs/types/common.types";
import logger from "../libs/utils/logger";
import Errors, { HttpCode, Message } from "../libs/Error";
import { Questions } from "../libs/enums/writingTask.enum";
import AItaskService from "../service/AI.service";
import WritingTaskService from "../service/WritingTask.service";

const taskController: T = {};
const aiService = new AItaskService();
const writingTaskService = new WritingTaskService();

// // generateWritingTask
// taskController.generateWritingTask = async (
//   req: ExtendedRequest,
//   res: Response
// ) => {
//   try {
//     logger.info("generateWritingTask");

//     const questionParam = req.params.question as string;
//     console.log("questionParam", questionParam);

//     const questionNumber = Number(questionParam);
//     if (![51, 52, 53, 54].includes(questionNumber)) {
//       throw new Errors(HttpCode.BAD_REQUEST, Message.UNSUPPORTED_QUESTION_TYPE);
//     }
//     let questionType: Questions;

//     switch (questionParam) {
//       case "51":
//         questionType = Questions.FIFTY_ONE;
//         break;
//       case "52":
//         questionType = Questions.FIFTY_TWO;
//         break;
//       case "53":
//         questionType = Questions.FIFTY_THREE;
//         break;
//       case "54":
//         questionType = Questions.FIFTY_FOUR;
//         break;
//       default:
//         throw new Errors(
//           HttpCode.BAD_REQUEST,
//           Message.UNSUPPORTED_QUESTION_TYPE
//         );
//     }

//     const result = await aiService.generateWritingTask(questionType);

//     const input = {
//       question: Number(questionParam),
//       prompt: result.prompt,
//       chartData: result.type === "CHART" ? result.chartData : null,
//       timeLimit: questionType === Questions.FIFTY_FOUR.valueOf() ? 70 : 30,
//     };

//     logger.info("Saving task to DB:");

//     const savedTask = await writingTaskService.createTask(input);

//     res.status(HttpCode.CREATED).json(savedTask);
//   } catch (err) {
//     logger.error("generateWritingTask", err);
//     if (err instanceof Errors) res.status(err.code).json(err);
//     else res.status(Errors.standard.code).json(Errors.standard);
//   }
// };

export default taskController;
