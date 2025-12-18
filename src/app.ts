import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rootRouter from "./routers";

/** ENTRANCE**/
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

/** ROUTERS**/
app.use("/", rootRouter);

export default app;
