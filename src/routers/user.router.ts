import express from "express";
import authController from "../controllers/auth.controller";
import userController from "../controllers/Users.controller";
import makeUpLoader from "../libs/utils/uploader";

const userRouter = express.Router();

// auth
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

// update
userRouter.post(
  "/update",
  authController.verifyAuth,
  makeUpLoader("users").single("userImage"),
  userController.updateUser
);

export default userRouter;
