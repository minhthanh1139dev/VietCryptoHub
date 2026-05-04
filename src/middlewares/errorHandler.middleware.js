"use strict";

import logger from "../utils/logger.js";
import { ErrorResponse, INTERNAL_SERVER_ERROR } from "../utils/response.js";

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err.statusCode || err.status || 500;
  const isClientError = status >= 400 && status < 500;

  if (isClientError) {
    logger.warn({ err });
  } else {
    logger.error({ err });
  }

  if (err instanceof ErrorResponse) {
    return err.send(res);
  }

  return new INTERNAL_SERVER_ERROR({
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  }).send(res);
}

export default errorHandler;
