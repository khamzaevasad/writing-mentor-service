import logger from "../libs/utils/logger";
import { User, UserInput } from "../libs/types/user.type";
import UsersModel from "../schema/Users.model";
import * as bcrypt from "bcrypt";
import Errors, { HttpCode, Message } from "../libs/Error";
class UserService {
  private readonly userModel;
  constructor() {
    this.userModel = UsersModel;
  }

  public async signup(input: UserInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    input.userPassword = await bcrypt.hash(input.userPassword, salt);

    try {
      const result = await this.userModel.create(input);
      result.userPassword = "";
      return result.toJSON();
    } catch (err) {
      logger.error("Error: model:signup", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }
}

export default UserService;
