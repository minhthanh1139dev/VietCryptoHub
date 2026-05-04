"use strict";

import { FORBIDDEN } from "../utils/response.js";
import config from "../config/config.js";

const APP_KEY = config.APP_KEY;

/**
 * Middleware to verify X-App-Key header
 */
export const verifyAppKey = (req, res, next) => {
  const appKey = req.headers["x-app-key"];

  if (!appKey || appKey !== APP_KEY) {
    return next(new FORBIDDEN({ message: "Invalid or missing X-App-Key" }));
  }

  next();
};
