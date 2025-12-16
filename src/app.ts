import express from "express";
import router from "./router";
import cors from "cors";
import cookieParser from "cookie-parser";

/** ENTRANCE**/
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

/** ROUTERS**/
app.use("/", router);

export default app;
