import { MISTRAL_API_URL, TIMEOUT_MS } from "@/utils/constants";

export const getMistralApiKey = () => {
  const key = localStorage.getItem("mistral_api_key");
  if (!key) {
    throw new Error(
      "No Mistral API key found. Please add your API key in Settings ⚙️"
    );
  }
  return key;
};

export const saveMistralApiKey = (key) => {
  localStorage.setItem("mistral_api_key", key.trim());
};

export const clearMistralApiKey = () => {
  localStorage.removeItem("mistral_api_key");
};

export const generateCaptionDirect = async ({
  prompt,
  tone,
  platform,
  imageBase64 = null,
}) => {
  const apiKey = getMistralApiKey();

  const { buildPrompt } = await import("../utils/utils");
  const fullPrompt = buildPrompt({ tone, userPrompt: prompt, platform });
  const content = [];

  if (imageBase64) {
    content.push({
      type: "image_url",
      image_url: { url: imageBase64 }, // already a data URI from resizeImage()
    });
  }

  content.push({ type: "text", text: fullPrompt });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        err.message || `Mistral API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "";
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("AI response timed out 😢");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};