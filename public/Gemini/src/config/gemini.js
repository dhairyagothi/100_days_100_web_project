import { GoogleGenAI } from "@google/genai";
const apikey = import.meta.env.VITE_API_KEY;

const ai = new GoogleGenAI({ apiKey: apikey });

async function main(prompt) {
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
}

export default main;

