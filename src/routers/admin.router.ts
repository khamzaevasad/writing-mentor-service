import express from "express";
import authController from "../controllers/auth.controller";
import { isAdmin } from "../middlewares/role.middleware";
import adminController from "../controllers/admin.controller";

const adminRouter = express.Router();

adminRouter.use(authController.verifyAuth);
adminRouter.use(isAdmin);

adminRouter.get("/get-all-users", adminController.getAllUsers);

adminRouter.get("/overview", adminController.overview);

export default adminRouter;
