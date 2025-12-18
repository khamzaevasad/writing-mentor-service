import express from "express";
import authController from "../controllers/auth.controller";

const userRouter = express.Router();

userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
userRouter.post("/logout", authController.verifyAuth, authController.logout);
userRouter.get(
  "/getUser",
  authController.verifyAuth,
  authController.getUserDetail
);
userRouter.post("/send-reset-otp", authController.sendResetOtp);
userRouter.post("/reset-password", authController.resetPassword);
userRouter.post(
  "/send-verify-otp",
  authController.verifyAuth,
  authController.generateVerifyOtp
);
userRouter.post(
  "/verify-account",
  authController.verifyAuth,
  authController.verifyEmail
);

export default userRouter;
