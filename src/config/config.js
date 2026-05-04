import dotenv from "dotenv";

dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,

  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/base-backend",
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "base-backend",

  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  APP_KEY: process.env.APP_KEY || "app_secret_key",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: "gemini-3-flash-preview",
  AI_PROVIDER: "gemini", // change to "grok" if needed
  GROK_API_KEY: process.env.GROK_API_KEY,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID,
};

export default config;
