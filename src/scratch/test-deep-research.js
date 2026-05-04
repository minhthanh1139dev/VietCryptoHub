"use strict";

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "deep-research-preview-04-2026",
      contents: "Analyze the crypto market news in one sentence.",
    });
    console.log("Deep Research Response:", response.text);
  } catch (error) {
    console.error("Deep Research Error:", error.message);
  }
}

main();
