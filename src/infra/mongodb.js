import mongoose from "mongoose";
import logger from "../utils/logger.js";
import env from "../config/config.js";

let connection = null;

class MongoDB {
  async connect() {
    if (connection) {
      return connection;
    }

    try {
      connection = await mongoose.connect(env.MONGODB_URI, {
        dbName: env.MONGODB_DB_NAME,
      });

      logger.info("Connected to MongoDB");
      return connection;
    } catch (error) {
      logger.error(`MongoDB connection error: ${error.message}`);
      throw error;
    }
  }

  async close() {
    if (connection) {
      await mongoose.connection.close();
      connection = null;
      logger.info("MongoDB connection closed");
    }
  }
}

export default new MongoDB();
