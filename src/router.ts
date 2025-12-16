import express from "express";
import authController from "./controllers/auth.controller";

const router = express.Router();

router.post("/user/signup", authController.signup);

export default router;
