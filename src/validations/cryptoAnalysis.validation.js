"use strict";

import Joi from "joi";

const getHistory = {
  query: Joi.object().keys({
    limit: Joi.number().integer().min(1).max(100).default(24),
    sentiment: Joi.string().valid("bullish", "bearish", "neutral"),
    from: Joi.date(),
    to: Joi.date(),
  }),
};

const getTrend = {
  query: Joi.object().keys({
    hours: Joi.number().integer().min(1).max(720).default(24),
  }),
};

export default {
  getHistory,
  getTrend,
};
