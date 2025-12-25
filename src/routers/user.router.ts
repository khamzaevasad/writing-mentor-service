import express from "express";
import authController from "../controllers/auth.controller";
import userController from "../controllers/Users.controller";
import makeUpLoader from "../libs/utils/uploader";
import taskController from "../controllers/task.controller";
import submissionController from "../controllers/submission.controller";
import evaluationController from "../controllers/evaluation.controller";
import examSessionController from "../controllers/examSession.controller";

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
// userRouter.get(
//   "/evaluation/generate/:question",
//   authController.verifyAuth,
//   taskController.generateWritingTask
// );

userRouter.post(
  "/evaluation/submit-answer",
  authController.verifyAuth,
  submissionController.submitAnswer
);
userRouter.post(
  "/check-result",
  authController.verifyAuth,
  evaluationController.evaluateSubmission
);

userRouter.post(
  "/check-results",
  authController.verifyAuth,
  evaluationController.evaluateSessionSubmissions
);

userRouter.post(
  "/start",
  authController.verifyAuth,
  examSessionController.startExamSession
);

userRouter.get(
  "/:sessionId/time",
  authController.verifyAuth,
  examSessionController.getRemainingTime
);

userRouter.post(
  "/complete/:sessionId",
  authController.verifyAuth,
  examSessionController.completeSession
);

userRouter.post(
  "/stop-exam",
  authController.verifyAuth,
  examSessionController.stopExam
);
export default userRouter;
