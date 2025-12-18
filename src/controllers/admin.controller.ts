import { Request, Response } from "express";
import logger from "../libs/utils/logger";
import { T } from "../libs/types/common.types";
import Errors, { HttpCode } from "../libs/Error";
import UserService from "../service/Users.Service";

const adminController: T = {};
const userService = new UserService();

// getAllUsers
adminController.getAllUsers = async (req: Request, res: Response) => {
  try {
    logger.info("getAllUsers");
    const result = await userService.getAllUsers();
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    logger.error("getUserDetail", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// overview
adminController.overview = async (req: Request, res: Response) => {
  try {
    logger.info("overview");
    const result = await userService.overview();
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    logger.error("overview", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default adminController;
