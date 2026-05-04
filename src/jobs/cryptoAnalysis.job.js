"use strict";

import cryptoAnalysisService from "../services/cryptoAnalysis.service.js";
import logger from "../utils/logger.js";

// CRONJOB 1: Phân tích tin tức — mỗi 4 tiếng
const periodicAnalysis = {
  name: "crypto-periodic-analysis",
  schedule: "0 */4 * * *", // Mỗi 4 tiếng
  action: async () => {
    await cryptoAnalysisService.performHourlyAnalysis();
  },
  runOnInit: false,
};

// CRONJOB 2: Kiểm tra giá & alert — mỗi 30 phút
const marketAlertCheck = {
  name: "crypto-market-alert",
  schedule: "*/30 * * * *", // Mỗi 30 phút
  action: async () => {
    const alertCount = await cryptoAnalysisService.checkMarketAlerts();
    if (alertCount > 0) {
      logger.info({ alertCount }, "Market alerts sent");
    }
  },
  runOnInit: false,
};

export default {
  periodicAnalysis,
  marketAlertCheck,
};
