import mongoose, { Schema } from "mongoose";
import { TargetLevel, UserStatus, UserType } from "../libs/enums/user.enum";

const UserSchema = new Schema(
  {
    userType: {
      type: String,
      enum: UserType,
      default: UserType.USER,
    },
    userStatus: {
      type: String,
      enum: UserStatus,
      default: UserStatus.ACTIVE,
    },
    userName: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },
    userEmail: {
      type: String,
      index: { unique: true, sparse: true },
      lowercase: true,
      trim: true,
      required: true,
    },
    userPassword: {
      type: String,
      select: false,
      required: true,
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
    targetLevel: {
      type: Number,
      enum: Object.values(TargetLevel).filter((v) => typeof v === "number"),
      default: TargetLevel.FIVE,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
