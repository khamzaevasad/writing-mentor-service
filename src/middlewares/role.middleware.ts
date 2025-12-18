import { NextFunction, Response, Request } from "express";
import Errors, { HttpCode, Message } from "../libs/Error";
import { UserType } from "../libs/enums/user.enum";
import { ExtendedRequest } from "../libs/types/user.type";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const extendedReq = req as ExtendedRequest;

  if (!extendedReq.user)
    throw new Errors(HttpCode.UNAUTHORIZED, Message.USER_NOT_AUTHENTICATED);
  if (extendedReq.user.userType !== UserType.ADMIN)
    throw new Errors(HttpCode.FORBIDDEN, Message.ADMIN_ACCESS);
  next();
};
