/**
 * AI-Assisted Notes Editor - Backend API
 * Handles communication with Google Gemini API
 * 
 * Setup Instructions:
 * 1. npm install express cors dotenv axios
 * 2. Get your Gemini API key from: https://aistudio.google.com/app/apikey
 * 3. Create a .env file in the same directory as this file with:
 *    GEMINI_API_KEY=your_api_key_here
 * 4. Run: node api-server.js
 */

const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static("../"));

// Store API key
const SARVAM_API_KEY = process.env.SARVAM_API_KEY || process.env.GEMINI_API_KEY;
const API_SECRET = process.env.API_SECRET || "default-secret-key-change-this";

if (!SARVAM_API_KEY) {
  console.error(
    "Error: SARVAM_API_KEY or GEMINI_API_KEY not found in environment variables. Please set it in .env file"
  );
  process.exit(1);
}

// Sarvam API configuration
const SARVAM_API_URL = "https://api.sarvam.ai/v1/chat/completions";

const SYSTEM_PROMPTS = {
  grammar: `You are an AI assistant that corrects spelling, grammar, typos, and punctuation errors. Return ONLY the corrected text. Do not add any introduction, explanation, or markdown.`,

  format: `You are an expert AI note-taking assistant. Your task is to transform raw, unformatted, or shorthand notes into a beautifully structured Markdown document.
You MUST:
1. Add a main heading (#) and logical subheadings (##) to organize the content.
2. Use bulleted lists (-) for lists and key concepts.
3. Structure scattered thoughts into coherent paragraphs.
4. Preserve all original terms, names, details, and user intent.
5. DO NOT add bold formatting (**word**) to ordinary words unless they are section headings.
6. Return ONLY the final formatted Markdown. No conversational filler, no introductions, no explanations.`,

  enhance: `You are an expert AI note-taking assistant. Your task is to correct all spelling, grammar, and punctuation mistakes, AND transform raw, unformatted, or shorthand notes into a beautifully structured Markdown document.
You MUST:
1. Fix all typos, spelling, capitalization, and grammatical errors.
2. Add a main heading (#) and logical subheadings (##) to organize the content.
3. Use bulleted lists (-) for lists and key concepts.
4. Structure scattered thoughts into coherent paragraphs.
5. Preserve all original technical terms, names, details, and user intent.
6. DO NOT add bold formatting (**word**) to ordinary words unless they are section headings.
7. Return ONLY the final corrected and formatted Markdown. No conversational filler, no introductions, no explanations.`,
};

// Rate limiting storage (simple in-memory)
const rateLimitStore = new Map();

// Simple rate limiting middleware
function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const limit = 30; // requests
  const window = 60000; // 1 minute

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }

  const requests = rateLimitStore.get(ip);
  const recentRequests = requests.filter((time) => now - time < window);

  if (recentRequests.length >= limit) {
    return res.status(429).json({
      error: "Too many requests. Please try again in a moment.",
    });
  }

  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
  next();
}

// Authentication middleware (optional but recommended)
function authenticateRequest(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.body.apiKey;
  
  // For development, allow requests from same origin
  const isSameOrigin = req.headers.origin?.includes("localhost") || 
                       req.headers.origin?.includes("127.0.0.1") ||
                       req.headers.referer?.includes(req.get("host"));
  
  // In production, require API key
  if (process.env.NODE_ENV === "production" && !isSameOrigin) {
    if (!apiKey || apiKey !== API_SECRET) {
      return res.status(401).json({
        error: "Unauthorized. Please provide valid API key.",
      });
    }
  }
  
  next();
}

// Main AI processing endpoint
app.post("/api/ai-process", rateLimit, authenticateRequest, async (req, res) => {
  try {
    const { action, text } = req.body;

    // Validation
    if (!action || !text) {
      return res.status(400).json({
        error: "Missing required fields: action and text",
      });
    }

    if (!["grammar", "format", "enhance"].includes(action)) {
      return res.status(400).json({
        error: "Invalid action. Must be 'grammar', 'format', or 'enhance'",
      });
    }

    if (typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({
        error: "Text must be a non-empty string",
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: "Text exceeds maximum length of 5000 characters",
      });
    }

    // Call Sarvam API
    const systemPrompt = SYSTEM_PROMPTS[action];
    const result = await callSarvamAPI(text, systemPrompt);

    res.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error:", error.message);

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: "Sarvam API rate limited. Please try again in a moment.",
      });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: "Invalid API key. Please check your SARVAM_API_KEY.",
      });
    }

    res.status(500).json({
      error: error.message || "Failed to process text. Please try again.",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Function to call Sarvam AI API
async function callSarvamAPI(text, systemPrompt) {
  const requestBody = {
    model: "sarvam-30b",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.3,
  };

  const response = await axios.post(SARVAM_API_URL, requestBody, {
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": SARVAM_API_KEY,
    },
    timeout: 30000, // 30 second timeout
  });

  // Extract the generated text from OpenAI-compatible response format
  if (
    response.data.choices &&
    response.data.choices[0] &&
    response.data.choices[0].message
  ) {
    return response.data.choices[0].message.content;
  }

  throw new Error("Unexpected Sarvam API response format");
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   AI-Assisted Notes Editor - Backend API Server           ║
║   Running on http://localhost:${PORT}                        ║
╚═══════════════════════════════════════════════════════════╝

✓ Health check: GET http://localhost:${PORT}/api/health
✓ Process text:  POST http://localhost:${PORT}/api/ai-process

Make sure your Sarvam API key is set in the .env file!
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});
