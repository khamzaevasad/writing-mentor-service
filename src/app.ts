import express from "express";
import path from "path";

/** ENTRANCE**/
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** ROUTERS**/

export default app;
