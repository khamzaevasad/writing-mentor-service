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
    userNick: {
      type: String,
      index: { unique: true, sparse: true },
      require: true,
    },
    userEmail: {
      type: String,
      index: { unique: true, sparse: true },
    },
    userPassword: {
      type: String,
      select: false,
      require: true,
    },
    targetLevel: {
      type: Number,
      enum: TargetLevel,
      default: TargetLevel.FIVE,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
