import userService from "../services/user.service.js";
import { OK, CREATED, BAD_REQUEST } from "../utils/response.js";

class UserController {
  async register(req, res) {
    const result = await userService.register(req.body);

    if (!result) {
      throw new BAD_REQUEST({
        message: "Failed to register",
      });
    }

    new CREATED({
      message: "Register successfully",
      data: { user: result.user },
    }).send(res);
  }

  async login(req, res) {
    const result = await userService.login(req.body);

    new OK({
      message: "Login successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    }).send(res);
  }

  async refresh(req, res) {
    const { refreshToken } = req.body;
    const tokens = await userService.refresh(refreshToken);

    new OK({
      message: "Token refreshed",
      data: tokens,
    }).send(res);
  }

  async logout(req, res) {
    // Stateless JWT — client chỉ cần xoá token ở phía mình
    new OK({ message: "Logout successfully" }).send(res);
  }
}

export default new UserController();

