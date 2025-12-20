import { CreateWritingTaskInput } from "../libs/types/writingTask.type";
import WritingTaskModel from "../schema/WritingTask.model";

class WritingTaskService {
  private readonly writingTaskModel;
  constructor() {
    this.writingTaskModel = WritingTaskModel;
  }

  public async createTask(input: CreateWritingTaskInput) {
    try {
      const task = await this.writingTaskModel.create({
        question: input.question,
        prompt: input.prompt,
        chartData: input.chartData,
        timeLimit: input.timeLimit,
      });

      return task;
    } catch (err) {
      console.log("Error model: createTask");
      throw err;
    }
  }
}

export default WritingTaskService;
