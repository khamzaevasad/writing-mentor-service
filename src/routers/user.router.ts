import express from "express";
import authController from "../controllers/auth.controller";
import userController from "../controllers/Users.controller";
import makeUpLoader from "../libs/utils/uploader";
import taskController from "../controllers/task.controller";

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
userRouter.post("/auth/refresh-token", authController.refreshToken);
// update
userRouter.post(
  "/update",
  authController.verifyAuth,
  makeUpLoader("users").single("userImage"),
  userController.updateUser
);

// openAI
userRouter.post(
  "/generate-task",
  authController.verifyAuth,
  taskController.generateWritingTask
);

export default userRouter;
