import { GoogleGenAI } from "@google/genai";
import { validatePrompt } from "../utils/requestValidator";
import { checkRateLimit } from "../utils/rateLimiter";
import {
  logRequest,
  logError,
} from "../utils/usageMonitor";

const apiKey = import.meta.env.VITE_API_KEY;

async function main(prompt) {
  validatePrompt(prompt);

  checkRateLimit();

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Please set VITE_API_KEY in your .env file."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    logRequest();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    logError();

    console.error("Gemini Error:", error);

    throw error;
  }
}

export default main;