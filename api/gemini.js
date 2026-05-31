const dotenv = require("dotenv");
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error:
        "Gemini API key is not configured on the server. Set GEMINI_API_KEY in your hosting environment.",
    });
  }

  // Server-side model allowlist. Accepting any caller-supplied model name lets
  // a caller request expensive or experimental models (gemini-2.5-pro,
  // gemini-1.5-pro-002) that cost significantly more per token. The server
  // owner pays all charges, so only explicitly permitted models are allowed.
  const ALLOWED_MODELS = new Set([
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
  ]);

  const { model, contents, systemPrompt } = req.body || {};
  if (!model || !Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  if (!ALLOWED_MODELS.has(model)) {
    return res.status(400).json({
      error: `Model '${model}' is not permitted. Allowed models: ${[...ALLOWED_MODELS].join(", ")}`,
    });
  }

  const payload = { contents };
  if (systemPrompt) {
    payload.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model,
    )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = data?.error?.message || `Gemini API error (${response.status})`;
      return res.status(response.status).json({ error: message, details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Unexpected server error",
    });
  }
};
