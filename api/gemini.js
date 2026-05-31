const dotenv = require("dotenv");
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Per-IP rate limiter. No external dependency required.
// Keys are client IP strings; values track request count and window start time.
// Limit: 20 requests per IP per minute, matching Gemini free-tier guidance.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 20;
const ipRequestMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipRequestMap.get(ip);

  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    ipRequestMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

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

  // Rate-limit by client IP to prevent a single caller from draining the quota.
  // Trust X-Forwarded-For only when running behind Vercel's edge network; fall
  // back to req.socket.remoteAddress for local or non-proxied environments.
  const clientIp =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(clientIp)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({
      error: "Too many requests. Please wait a moment before trying again.",
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

  // Bound the total serialised size of the contents array before forwarding.
  // Without this check a single request containing a multi-megabyte payload
  // can exhaust the token quota in one call. The limit of 32 KB is generous
  // for normal chat turns and well within the UI's typical message sizes.
  const MAX_CONTENTS_BYTES = 32 * 1024; // 32 KB
  const contentsJson = JSON.stringify(contents);
  if (contentsJson.length > MAX_CONTENTS_BYTES) {
    return res.status(400).json({
      error: `Request payload too large. The contents array must not exceed ${MAX_CONTENTS_BYTES} bytes when serialised.`,
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
