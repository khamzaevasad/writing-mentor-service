import logger from "../libs/utils/logger";
import { LoginInput, User, UserInput } from "../libs/types/user.type";
import UsersModel from "../schema/Users.model";
import * as bcrypt from "bcrypt";
import Errors, { HttpCode, Message } from "../libs/Error";
import { UserStatus } from "../libs/enums/user.enum";
import { shapeIntoMongooseObjectId } from "../libs/config/config";

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
    } catch (err: any) {
      logger.error("Error: model:signup", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.ALREADY_EXISTS);
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

      user.userPassword = "";
      return user;
    } catch (err) {
      logger.error("Error: model:login", err);
      throw err;
    }
  }

  // getUser
  public async getUserDetail(user: User): Promise<User> {
    try {
      const userId = shapeIntoMongooseObjectId(user._id);
      const result = await this.userModel
        .findOne({
          _id: userId,
          userStatus: UserStatus.ACTIVE,
        })
        .exec();
      if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      return result;
    } catch (err) {
      console.log("ERROR model:getUserDetail", err);
      throw err;
    }
  }

  // generateVerifyOtp
  public async generateVerifyOtp(
    user: User
  ): Promise<{ email: string; otp: string }> {
    try {
      const userId = shapeIntoMongooseObjectId(user._id);
      const foundUser = await this.userModel.findById(userId).exec();

      if (!foundUser)
        throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      if (foundUser.isAccountVerified)
        throw new Errors(HttpCode.BAD_REQUEST, Message.ALREADY_VERIFIED);

      const otp = String(Math.floor(100000 + Math.random() * 900000));

      foundUser.verifyOtp = otp;
      foundUser.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
      //  foundUser.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; < = 10min
      await foundUser.save();

      return { email: foundUser.userEmail, otp: otp };
    } catch (err) {
      logger.error("Error: model:generateVerifyOtp");
      throw err;
    }
  }

  // verifyEmail
  public async verifyEmail(user: User, otp: string): Promise<User> {
    try {
      const userId = shapeIntoMongooseObjectId(user?._id);

      const result = await this.userModel.findById(userId);

      if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      if (result.verifyOtp === "" || result.verifyOtp !== otp)
        throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_OTP);

      if (result.verifyOtpExpireAt < Date.now())
        throw new Errors(HttpCode.BAD_REQUEST, Message.OTP_EXPIRED);

      result.isAccountVerified = true;
      result.verifyOtp = "";
      result.verifyOtpExpireAt = 0;

      await result.save();

      return result;
    } catch (err) {
      console.log("Error model: verifyEmail");
      throw err;
    }
  }

  // sendResetOtp
  public async sendResetOtp(
    userEmail: string
  ): Promise<{ email: string; otp: string }> {
    try {
      const user = await this.userModel.findOne({ userEmail }).exec();

      if (!user) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      const otp = String(Math.floor(100000 + Math.random() * 900000));

      user.resetOtp = otp;
      user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

      await user.save();

      return { email: user.userEmail, otp: otp };
    } catch (err) {
      logger.error("Error model: sendResetOtp");
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
  }

  // resetPassword
  public async resetPassword(
    userEmail: string,
    otp: string,
    newPassword: string
  ): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({ userEmail })
        .select("+userPassword")
        .exec();

      if (!user) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      if (user.resetOtp === "" || user.resetOtp !== otp)
        throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_OTP);

      if (user.resetOtpExpireAt < Date.now())
        throw new Errors(HttpCode.BAD_REQUEST, Message.OTP_EXPIRED);

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.userPassword = hashedPassword;
      user.resetOtp = "";
      user.resetOtpExpireAt = 0;

      await user.save();

      return user;
    } catch (err) {
      console.log("Error Model: resetPassword", err);
      throw err;
    }
  }

  // findUser
  public async findUser(id: string): Promise<User> {
    try {
      const userId = shapeIntoMongooseObjectId(id);
      const result = await this.userModel
        .findById(userId)
        .select("-userPassword")
        .exec();
      if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
      return result;
    } catch (err) {
      logger.error("Error: model:findUser", err);
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }
  }
}

export default UserService;
