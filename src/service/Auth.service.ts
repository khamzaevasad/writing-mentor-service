import jwt from "jsonwebtoken";
import {
  AUTH_TIMER_ACCESS,
  AUTH_TIMER_REFRESH_HOURS,
} from "../libs/config/config";
import { User, UserDecoded } from "../libs/types/user.type";
import Errors, { HttpCode, Message } from "../libs/Error";
import logger from "../libs/utils/logger";
import UserService from "./Users.Service";
import { UserStatus } from "../libs/enums/user.enum";
import { Types } from "mongoose";

class AuthService {
  private readonly secretToken;
  private userService: UserService;

  constructor() {
    this.secretToken = process.env.SECRET_TOKEN as string;
    this.userService = new UserService();
  }

  // createAccessToken
  public async createAccessToken(payload: User) {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER_ACCESS}m`;
      jwt.sign(
        {
          _id: payload._id,
          userName: payload.userName,
        },
        this.secretToken,
        { expiresIn: duration },
        (err, token) => {
          if (err)
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
            );
          else resolve(token as string);
        }
      );
    });
  }

  // createRefreshToken
  public async createRefreshToken(id: Types.ObjectId) {
    const duration = `${AUTH_TIMER_REFRESH_HOURS}h`;
    return jwt.sign({ _id: id }, this.secretToken, {
      expiresIn: duration,
    });
  }

  // decoded
  public async decoded(token: string): Promise<UserDecoded> {
    try {
      return jwt.verify(token, this.secretToken) as UserDecoded;
    } catch (err) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.USER_NOT_AUTHENTICATED);
    }
  }

  // checkAuth
  public async checkAuth(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, this.secretToken) as {
        _id: string;
        userName: string;
      };

      logger.info(`Token decoded for user: ${decoded.userName}`);

      const user = await this.userService.findUser(decoded._id);

      if (!user) {
        logger.warn(`User not found: ${decoded._id}`);
        return null;
      }

      if (user.userStatus === UserStatus.BLOCK) {
        logger.warn(`Blocked user try to access ${user.userName}`);
        return null;
      }

      logger.info(`---[auth]--- ${user.userName}`);
      return user;
    } catch (err) {
      logger.error("checkAuth", err);
      throw err;
    }
  }
}

export default AuthService;
