import mongoose from "mongoose";
export const MORGAN_FORMAT = `:method :url - :response-time [:status] \n`;
export const AUTH_TIMER_ACCESS = 15;
export const AUTH_TIMER_REFRESH_HOURS = 16;

export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};
