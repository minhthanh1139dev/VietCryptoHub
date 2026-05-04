"use strict";

import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import config from "../config/config.js";
import logger from "../utils/logger.js";
import { INTERNAL_SERVER_ERROR } from "../utils/response.js";

class AIService {
  constructor() {
    this.provider = config.AI_PROVIDER;

    // Initialize Gemini
    this.gemini = new GoogleGenAI({
      apiKey: config.GEMINI_API_KEY,
    });
    this.geminiModel = config.GEMINI_MODEL;

    // Initialize Grok (via OpenAI SDK)
    if (config.GROK_API_KEY) {
      this.grok = new OpenAI({
        apiKey: config.GROK_API_KEY,
        baseURL: "https://api.x.ai/v1",
      });
    }
  }

  /**
   * Generate content from a prompt and return it as a JSON object
   * @param {string} prompt
   * @returns {Promise<Object>}
   */
  async generateJSON(prompt) {
    if (this.provider === "grok") {
      return await this._generateGrokJSON(prompt);
    }
    return await this._generateGeminiJSON(prompt);
  }

  async _generateGeminiJSON(prompt) {
    try {
      const response = await this.gemini.models.generateContent({
        model: this.geminiModel,
        contents: prompt + "\n\nRespond only with valid JSON.",
      });

      let text = response.text;
      return this._parseJSON(text);
    } catch (error) {
      logger.error({ error: error.message }, "Gemini API error");
      throw new INTERNAL_SERVER_ERROR({
        message: "Gemini API failure: " + error.message,
      });
    }
  }

  async _generateGrokJSON(prompt) {
    if (!this.grok) {
      throw new INTERNAL_SERVER_ERROR({
        message: "Grok API key not configured",
      });
    }

    try {
      const response = await this.grok.chat.completions.create({
        model: "grok-beta", // or the latest grok model
        messages: [
          {
            role: "system",
            content:
              "You are a professional crypto analyst. Output only valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      const text = response.choices[0].message.content;
      return JSON.parse(text);
    } catch (error) {
      logger.error({ error: error.message }, "Grok API error");
      throw new INTERNAL_SERVER_ERROR({
        message: "Grok API failure: " + error.message,
      });
    }
  }

  _parseJSON(text) {
    // Clean the text if AI wraps it in markdown code blocks
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      logger.error({ text, error: parseError.message }, "AI JSON parse error");
      throw new INTERNAL_SERVER_ERROR({
        message: "Failed to parse AI response as JSON",
      });
    }
  }
}

export default new AIService();
