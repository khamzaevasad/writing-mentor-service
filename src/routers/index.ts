import express from "express";
import userRouter from "./user.router";
import adminRouter from "./admin.router";

const rootRouter = express();

rootRouter.use("/user", userRouter);
rootRouter.use("/admin", adminRouter);

export default rootRouter;
