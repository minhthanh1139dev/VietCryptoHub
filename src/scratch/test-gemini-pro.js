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
      model: "gemini-3.1-pro-preview",
      contents: "Explain the current state of crypto news in 2026 in one sentence.",
    });
    console.log("Gemini Pro Response:", response.text);
  } catch (error) {
    console.error("Gemini Pro Error:", error.message);
  }
}

main();
