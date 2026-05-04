"use strict";

import express from "express";
import asyncHandler from "express-async-handler";
import cryptoAnalysisController from "../controllers/cryptoAnalysis.controller.js";
import cryptoAnalysisValidation from "../validations/cryptoAnalysis.validation.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.get(
  "/latest",
  asyncHandler(cryptoAnalysisController.getLatest)
);

router.get(
  "/history",
  validate(cryptoAnalysisValidation.getHistory),
  asyncHandler(cryptoAnalysisController.getHistory)
);

router.get(
  "/sentiment-trend",
  validate(cryptoAnalysisValidation.getTrend),
  asyncHandler(cryptoAnalysisController.getSentimentTrend)
);

router.get(
  "/trending-assets",
  validate(cryptoAnalysisValidation.getTrend),
  asyncHandler(cryptoAnalysisController.getTrendingAssets)
);

router.post(
  "/trigger",
  asyncHandler(cryptoAnalysisController.triggerAnalysis)
);

export default router;
