import jwt from "jsonwebtoken";
import { AUTH_TIMER } from "../libs/config";
import { User } from "../libs/types/user.type";
import Errors, { HttpCode, Message } from "../libs/Error";
import logger from "../libs/utils/logger";

class AuthService {
  private readonly secretToken;
  constructor() {
    this.secretToken = process.env.SECRET_TOKEN as string;
  }

  public async createToken(payload: User) {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER}`;
      jwt.sign(
        payload,
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
  public async checkAuth(token: string): Promise<User> {
    const result: User = jwt.verify(token, this.secretToken) as User;
    logger.info(`---[auth] ${result.userName}`);
    return result;
  }
}

export default AuthService;
