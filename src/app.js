"use strict"

import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import apiRoutes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import { CORS_ORIGINS } from "./constants/app.constants.js";
import { NOT_FOUND } from "./utils/response.js";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

app.use(
  cors({
    origin: CORS_ORIGINS, // hoặc "*" nếu dev local thoải mái
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(morgan("combined"));
app.use("/api/v1", apiRoutes);

app.use((req, res, next) => next(new NOT_FOUND()));

app.use(errorHandler);

export default app;
