import { Request, Response } from "express";
import { T } from "../libs/types/common.types";
import logger from "../libs/utils/logger";
import Errors, { HttpCode } from "../libs/Error";
import { UserInput } from "../libs/types/user.type";
import AuthService from "../service/Auth.service";
import UserService from "../service/Users.Service";
import { AUTH_TIMER } from "../libs/config";
const authController: T = {};

const authService = new AuthService();
const userService = new UserService();

authController.signup = async (req: Request, res: Response) => {
  const input: UserInput = req.body;
  if (!input.userName || !input.userEmail || !input.userPassword) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    logger.info("signup");

    const result = await userService.signup(input);
    const token = await authService.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });
    res.status(HttpCode.OK).json({ user: result, accessToken: token });
  } catch (err) {
    logger.error("Error signup", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default authController;
