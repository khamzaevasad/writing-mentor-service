import { Types } from "mongoose";
import { TargetLevel, UserStatus, UserType } from "../enums/user.enum";
import { Request } from "express";
export interface User {
  _id: Types.ObjectId;
  userType: UserType;
  userStatus: UserStatus;
  userName: string;
  userEmail: string;
  userPassword?: string;
  userImage?: string | null;
  userDesc?: string | null;
  refreshToken?: string | null;
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

export interface userUpdateInput {
  _id: Types.ObjectId;
  userName?: string;
  userImage?: string;
  userDesc?: string;
}

export interface LoginInput {
  userEmail: string;
  userPassword: string;
}

export interface UserDecoded {
  _id: string;
  userName: string;
}

export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
}
export interface ExtendedRequest extends Request {
  user: User;
  file: Express.Multer.File;
}
