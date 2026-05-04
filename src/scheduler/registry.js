"use strict"

import cron from "node-cron";
import logger from "../utils/logger.js";

/**
 * Registry to manage and track cron jobs
 */
class CronJobRegistry {
  constructor() {
    this.jobs = new Map();
  }

  /**
   * Register a new cron job
   * @param {Object} job - Job definition
   * @param {string} job.name - Unique name for the job
   * @param {string} job.schedule - Cron schedule string
   * @param {Function} job.action - Async function to execute
   * @param {boolean} [job.runOnInit] - Whether to run the job once immediately
   */
  register(job) {
    const task = cron.schedule(job.schedule, async () => {
      const start = Date.now();
      try {
        await job.action();
        logger.info({ job: job.name, ms: Date.now() - start }, "job done");
      } catch (error) {
        logger.error({ job: job.name, error: error.message }, "job failed");
      }
    });

    this.jobs.set(job.name, task);
    logger.info({ job: job.name, schedule: job.schedule }, "registered");

    if (job.runOnInit) {
      logger.info(`Running initial execution for: ${job.name}`);
      Promise.resolve(job.action()).catch((error) => {
        logger.error({ job: job.name, error: error.message }, "initial execution failed");
      });
    }
  }

  /**
   * Stop all registered jobs
   */
  stopAll() {
    for (const [name, task] of this.jobs) {
      task.stop();
      logger.info(`Stopped cron job: ${name}`);
    }
    this.jobs.clear();
  }
}

export default new CronJobRegistry();
