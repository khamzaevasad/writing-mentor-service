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

export default router;
