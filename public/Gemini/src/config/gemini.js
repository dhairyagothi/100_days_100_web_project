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
const apikey = import.meta.env.VITE_API_KEY;

async function main(prompt) {
  if (!apikey) {
    console.error("VITE_API_KEY is missing. Please add it to your .env file.");
    return "Error: API Key is missing. Please configure VITE_API_KEY in your .env file.";
  }

  const ai = new GoogleGenAI({ apiKey: apikey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error: " + error.message;
  }
}

export default main;
