"use strict"

import logger from "../../utils/logger.js";
import MongoDB from "../../infra/mongodb.js";
import cronRegistry from "../../scheduler/registry.js";

// ── Import jobs ──────────────────────────────────────────────────────────────
import fileJob from "../../jobs/file.job.js";
import cryptoAnalysisJob from "../../jobs/cryptoAnalysis.job.js";

const start = async () => {
  try {
    // 1. Connect to Infrastructure
    await MongoDB.connect();

    // 2. Register Cron Jobs
    cronRegistry.register(fileJob.cleanupOrphanUploads);
    cronRegistry.register(cryptoAnalysisJob.periodicAnalysis);
    cronRegistry.register(cryptoAnalysisJob.marketAlertCheck);

    logger.info("scheduler worker is running");
  } catch (error) {
    logger.error({ error: error.message }, "failed to start scheduler worker");
    process.exit(1);
  }
};

const shutdown = async () => {
  logger.info("shutting down scheduler worker");
  try {
    cronRegistry.stopAll();
    await MongoDB.close();
    logger.info("scheduler shutdown complete");
    process.exit(0);
  } catch (error) {
    logger.error({ error: error.message }, "failed to shutdown scheduler worker");
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
