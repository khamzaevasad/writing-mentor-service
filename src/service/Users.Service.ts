import logger from "../libs/utils/logger";
import { LoginInput, User, UserInput } from "../libs/types/user.type";
import UsersModel from "../schema/Users.model";
import * as bcrypt from "bcrypt";
import Errors, { HttpCode, Message } from "../libs/Error";
import { UserStatus } from "../libs/enums/user.enum";
class UserService {
  private readonly userModel;
  constructor() {
    this.userModel = UsersModel;
  }

  // signup
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

  // login
  public async login(input: LoginInput): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({
          userEmail: input.userEmail,
          userStatus: { $ne: UserStatus.DELETE },
        })
        .select("+userPassword")
        .lean()
        .exec();

      if (!user) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

      if (user.userStatus === UserStatus.BLOCK)
        throw new Errors(HttpCode.FORBIDDEN, Message.USER_BLOCKED);

      const isMatch = await bcrypt.compare(
        input.userPassword,
        user.userPassword
      );

      if (!isMatch)
        throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

      return user;
    } catch (err) {
      logger.error("Error: model:login", err);
      throw err;
    }
  }
}

export default UserService;
