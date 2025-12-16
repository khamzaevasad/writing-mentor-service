import { Types } from "mongoose";
import { TargetLevel, UserStatus, UserType } from "../enums/user.enum";

export interface User {
  _id: Types.ObjectId;
  userType: UserType;
  userStatus: UserStatus;
  userName: string;
  userEmail: string;
  userPassword?: string;
  verifyOtp: string;
  verifyOtpExpireAt: number;
  isAccountVerified: boolean;
  resetOtp: string;
  resetOtpExpireAt: number;
  targetLevel: TargetLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  userName: string;
  userEmail: string;
  userPassword: string;
}

export interface LoginInput {
  userEmail: string;
  userPassword: string;
}
