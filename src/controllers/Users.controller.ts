import { Response } from "express";
import { ExtendedRequest, userUpdateInput } from "../libs/types/user.type";
import { T } from "../libs/types/common.types";
import logger from "../libs/utils/logger";
import Errors, { HttpCode } from "../libs/Error";
import UserService from "../service/Users.Service";

const userController: T = {};
const userService = new UserService();

userController.updateUser = async (req: ExtendedRequest, res: Response) => {
  try {
    logger.info("updateUser");

    const input: userUpdateInput = req.body;
    if (req.file) input.userImage = req.file.path.replace(/\\/, "/");
    const result = await userService.updateUser(req.user, input);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    logger.error("getUserDetail", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default userController;
