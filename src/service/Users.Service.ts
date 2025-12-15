import UsersModel from "../schema/Users.model";

class UserService {
  private readonly userModel;
  constructor() {
    this.userModel = UsersModel;
  }
}
