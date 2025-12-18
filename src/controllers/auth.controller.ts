import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common.types";
import logger from "../libs/utils/logger";
import Errors, { HttpCode, Message } from "../libs/Error";
import {
  ExtendedRequest,
  LoginInput,
  UserInput,
} from "../libs/types/user.type";
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

    // Sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: input.userEmail,
      subject: "Welcome to Writing Mentor",
      text: `Welcome to Writing Mentor website, Your account has been created with email id: ${input.userEmail}`,
    };

    await transporter.sendMail(mailOptions);
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
    logger.info("logout");
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

// generateVerifyOtp
authController.generateVerifyOtp = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    logger.info("generateVerifyOtp");
    const { email, otp } = await userService.generateVerifyOtp(req.user);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}`,
    });
    res.status(HttpCode.OK).json({ success: true, message: "OTP sent" });
  } catch (err) {
    logger.error("generateVerifyOtp", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// verifyEmail
authController.verifyEmail = async (req: ExtendedRequest, res: Response) => {
  try {
    logger.info("verifyEmail");
    const { otp } = req.body;
    if (!otp) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const result = await userService.verifyEmail(req.user, otp);

    res
      .status(HttpCode.OK)
      .json({ result: result, message: "email verify successfully" });
  } catch (err) {
    logger.error("verifyEmail", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// sendResetOtp
authController.sendResetOtp = async (req: Request, res: Response) => {
  try {
    logger.info("sendResetOtp");
    const { userEmail } = req.body;
    if (!userEmail)
      throw new Errors(HttpCode.BAD_REQUEST, Message.EMAIL_REQUIRED);

    const { email, otp } = await userService.sendResetOtp(userEmail);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password`,
    });
    res
      .status(HttpCode.OK)
      .json({ success: "true", message: "OTP sent Your email" });
  } catch (err) {
    logger.error("sendRestOtp");
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// resetPassword
authController.resetPassword = async (req: Request, res: Response) => {
  try {
    const { userEmail, otp, newPassword } = req.body;
    if (!userEmail || !otp || !newPassword)
      throw new Errors(HttpCode.BAD_REQUEST, Message.ALL_REQUIRED);

    const result = await userService.resetPassword(userEmail, otp, newPassword);

    res
      .status(HttpCode.OK)
      .json({ user: result, message: Message.RESET_PASSWORD });
  } catch (err) {
    logger.error("resetPassword", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// getUser
authController.getUserDetail = async (req: ExtendedRequest, res: Response) => {
  try {
    logger.info("getUserDetail");
    const result = await userService.getUserDetail(req.user);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    logger.error("getUserDetail", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// verifyAuth middleware
authController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("verifyAuth");

    const token = req.cookies["accessToken"];

    if (!token)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.USER_NOT_AUTHENTICATED);

    const user = await authService.checkAuth(token);
    if (!user)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.USER_NOT_AUTHENTICATED);

    req.user = user;

    next();
  } catch (err) {
    logger.error("verifyAuth", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// roleMiddleware
authController.roleMiddleware = async (req: ExtendedRequest, res: Response) => {
  try {
    logger.info("roleMiddleware");
  } catch (err) {
    logger.error("roleMiddleware", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default authController;
