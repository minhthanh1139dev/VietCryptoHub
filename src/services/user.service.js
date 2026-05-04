"use strict"

import { CONFLICT, UNAUTHORIZED, FORBIDDEN } from "../utils/response.js";
import userRepository from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

class UserService {
  async register({ username, password }) {
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      throw new CONFLICT({ message: "Username already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userRepository.create({
      username,
      password: hashedPassword,
      role: "admin",
    });

    if (!newUser) {
      throw new FORBIDDEN({ message: "User not registered" });
    }

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return { user: userResponse };
  }

  async login({ username, password }) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new UNAUTHORIZED({ message: "Invalid username or password" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UNAUTHORIZED({ message: "Invalid username or password" });
    }

    const payload = { id: user._id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new UNAUTHORIZED({ message: "Missing refresh token" });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new UNAUTHORIZED({ message: "Invalid refresh token" });
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new UNAUTHORIZED({ message: "User not found" });
    }

    const payload = { id: user._id, role: user.role };
    return {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  }
}

export default new UserService();
