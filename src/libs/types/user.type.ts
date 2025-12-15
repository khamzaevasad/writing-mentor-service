import { ObjectId } from "mongoose";
import { TargetLevel } from "../enums/user.enum";

export interface User {
  _id: ObjectId;
  userNick: string;
  email: string;
  password?: string;
  targetLevel?: TargetLevel;
  createdAt: Date;
  updateAt: Date;
}
