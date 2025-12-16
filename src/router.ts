import express from "express";
import authController from "./controllers/auth.controller";

const router = express.Router();

router.post("/user/signup", authController.signup);
router.post("/user/login", authController.login);
router.post("/user/logout", authController.logout);
router.get(
  "/user/getUser",
  authController.verifyAuth,
  authController.getUserDetail
);
router.post(
  "/user/send-verify-otp",
  authController.verifyAuth,
  authController.generateVerifyOtp
);
router.post(
  "/user/verify-account",
  authController.verifyAuth,
  authController.verifyEmail
);

router.post("/user/send-reset-otp", authController.sendResetOtp);
router.post("/user/reset-password", authController.resetPassword);

export default router;
