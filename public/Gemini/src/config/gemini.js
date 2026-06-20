import { GoogleGenAI } from "@google/genai";

async function main(prompt) {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Please set VITE_API_KEY in your .env file."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}

export default main;