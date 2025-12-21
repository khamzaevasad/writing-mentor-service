import { Types } from "mongoose";
import ExamSessionModel from "../schema/ExamSession.model";
import AIService from "./AI.service";
import WritingTaskService from "./WritingTask.service";
import Errors, { HttpCode, Message } from "../libs/Error";
import logger from "../libs/utils/logger";
import { Questions } from "../libs/enums/writingTask.enum";

class ExamSessionService {
  private readonly examSessionModel;
  private readonly writingTaskService;
  private readonly aiService;

  constructor() {
    this.examSessionModel = ExamSessionModel;
    this.writingTaskService = new WritingTaskService();
    this.aiService = new AIService();
  }

  //   startExam
  public async startExamSession(userId: string | Types.ObjectId) {
    try {
      const existingSession = await this.examSessionModel.findOne({
        userId: new Types.ObjectId(userId),
        status: "active",
      });

      if (existingSession) {
        const now = Date.now();
        const elapsed = now - existingSession.startTime.getTime();

        if (elapsed > existingSession.timeLimit) {
          existingSession.status = "expired";
          existingSession.endTime = new Date();
          await existingSession.save();
        } else {
          throw new Errors(HttpCode.BAD_REQUEST, Message.ACTIVE_EXAM);
        }
      }

      console.log("🎯 Generating 4 writing tasks...");

      const taskPromises = [
        this.aiService.generateWritingTask(Questions.FIFTY_ONE),
        this.aiService.generateWritingTask(Questions.FIFTY_TWO),
        this.aiService.generateWritingTask(Questions.FIFTY_THREE),
        this.aiService.generateWritingTask(Questions.FIFTY_FOUR),
      ];

      const results = await Promise.all(taskPromises);

      const savedTasks = [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const questionNumber = 51 + i;

        const taskData = {
          question: questionNumber,
          prompt: result.prompt,
          chartData: result.type === "CHART" ? result.chartData : null,
        };

        const savedTask = await this.writingTaskService.createTask(taskData);
        savedTasks.push(savedTask);
      }

      console.log("✅ 4 tasks created successfully");

      const session = await this.examSessionModel.create({
        userId: new Types.ObjectId(userId),
        taskIds: savedTasks.map((task) => task._id),
        startTime: new Date(),
        timeLimit: 50 * 60 * 1000,
        status: "active",
      });

      console.log("🚀 Exam session started:", session._id);

      return {
        session: {
          sessionId: session._id,
          startTime: session.startTime,
          timeLimit: session.timeLimit,
          remainingTime: session.timeLimit,
          status: session.status,
        },
        tasks: savedTasks,
      };
    } catch (err) {
      console.error("Error starting exam session:", err);
      throw err;
    }
  }

  //    getRemainingTime
  public async getRemainingTime(sessionId: string | Types.ObjectId) {
    try {
      const session = await this.examSessionModel.findById(sessionId);

      if (!session) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      if (session.status !== "active") {
        return { remainingTime: 0, status: session.status };
      }

      const now = Date.now();
      const elapsed = now - session.startTime.getTime();
      const remaining = Math.max(0, session.timeLimit - elapsed);

      if (remaining === 0 && session.status === "active") {
        session.status = "expired";
        session.endTime = new Date();
        await session.save();
      }

      return {
        remainingTime: remaining,
        status: session.status,
      };
    } catch (err) {
      logger.error("Error model: getRemainingTime", err);
      throw err;
    }
  }

  //   completeSession
  public async completeSession(sessionId: string | Types.ObjectId) {
    try {
      const session = await this.examSessionModel.findById(sessionId);

      if (!session) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      if (session.status !== "active") {
        throw new Errors(HttpCode.BAD_REQUEST, Message.SESSION_IS_NOT_ACTIVE);
      }

      session.status = "completed";
      session.endTime = new Date();
      await session.save();

      console.log("Session completed", sessionId);

      return session;
    } catch (err) {
      console.log("Error model: completeSession", err);
      throw err;
    }
  }

  public async getSession(sessionId: string | Types.ObjectId) {
    try {
      const session = await this.examSessionModel.findById(sessionId);

      if (!session) {
        throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
      }

      return session;
    } catch (err) {
      console.error("Error getting session:", err);
      throw err;
    }
  }
}

export default ExamSessionService;
