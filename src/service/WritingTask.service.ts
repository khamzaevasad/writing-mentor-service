import Errors, { HttpCode, Message } from "../libs/Error";
import {
  CreateWritingTaskInput,
  IWritingTask,
} from "../libs/types/writingTask.type";
import WritingTaskModel from "../schema/WritingTask.model";

class WritingTaskService {
  private readonly writingTaskModel;
  constructor() {
    this.writingTaskModel = WritingTaskModel;
  }

  public async createTask(
    input: CreateWritingTaskInput
  ): Promise<IWritingTask> {
    try {
      const task = await this.writingTaskModel.create(input);

      if (!task)
        throw new Errors(HttpCode.NOT_MODIFIED, Message.TASK_CREATION_FAILED);
      return task;
    } catch (err) {
      console.log("Error model: createTask");
      throw err;
    }
  }
}

export default WritingTaskService;
