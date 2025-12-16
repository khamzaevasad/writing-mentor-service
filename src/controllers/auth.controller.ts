import { Request, Response } from "express";
import { T } from "../libs/types/common.types";
import logger from "../libs/utils/logger";
import Errors, { HttpCode } from "../libs/Error";
import { LoginInput, UserInput } from "../libs/types/user.type";
import AuthService from "../service/Auth.service";
import UserService from "../service/Users.Service";
import { AUTH_TIMER } from "../libs/config/config";
import transporter from "../libs/config/nodemailer";
const authController: T = {};

const authService = new AuthService();
const userService = new UserService();

// signup
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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: AUTH_TIMER * 3600 * 1000,
    });

    // testEmail
    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP ERROR ❌", error);
      } else {
        console.log("SMTP READY ✅");
      }
    });

    // Sending welcome email
    const mainOptions = {
      from: process.env.SENDER_EMAIL,
      to: input.userEmail,
      subject: "Welcome to Writing Mentor",
      text: `Welcome to Writing Mentor website, Your account has been created with email id: ${input.userEmail}`,
    };

    await transporter.sendMail(mainOptions);
    res.status(HttpCode.OK).json({ user: result, accessToken: token });
  } catch (err) {
    logger.error("Error signup", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// login
authController.login = async (req: Request, res: Response) => {
  const input: LoginInput = req.body;

  if (!input.userEmail || !input.userPassword) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    logger.info("login");
    const result = await userService.login(input);
    const token = await authService.createToken(result);
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: AUTH_TIMER * 3600 * 1000,
    });
    res.status(HttpCode.OK).json({ user: result, accessToken: token });
  } catch (err) {
    logger.error("Error login", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// logout
authController.logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.status(HttpCode.OK).json({ logout: true });
  } catch (err) {
    logger.error("Error logout", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default authController;
