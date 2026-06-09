// server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_ALLOWED_ORIGINS = [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
];
const REQUEST_BODY_LIMIT = process.env.JSON_BODY_LIMIT || '16kb';
const requestBuckets = new Map();

function parseCsv(value) {
    return value
        ? value.split(',').map(item => item.trim()).filter(Boolean)
        : [];
}

function readPositiveInteger(name, fallback) {
    const parsed = Number.parseInt(process.env[name] || '', 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const configuredOrigins = parseCsv(process.env.ALLOWED_ORIGINS || process.env.FRONTEND_ORIGIN);
const allowedOrigins = configuredOrigins.length
    ? configuredOrigins
    : DEFAULT_ALLOWED_ORIGINS;
const MAX_MESSAGE_LENGTH = readPositiveInteger('CHAT_MESSAGE_MAX_LENGTH', 2000);
const RATE_LIMIT_WINDOW_MS = readPositiveInteger('CHAT_RATE_LIMIT_WINDOW_MS', 60000);
const RATE_LIMIT_MAX_REQUESTS = readPositiveInteger('CHAT_RATE_LIMIT_MAX_REQUESTS', 20);

function corsOrigin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
    }

    const error = new Error('Origin not allowed by CORS');
    error.statusCode = 403;
    return callback(error);
}

function rateLimitChat(req, res, next) {
    const now = Date.now();
    const clientId = req.ip || req.socket.remoteAddress || 'unknown';

    for (const [bucketClientId, bucket] of requestBuckets) {
        if (now > bucket.resetAt) {
            requestBuckets.delete(bucketClientId);
        }
    }

    const bucket = requestBuckets.get(clientId);

    if (!bucket || now > bucket.resetAt) {
        requestBuckets.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return next();
    }

    if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
        const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);
        res.set('Retry-After', String(retryAfterSeconds));
        return res.status(429).json({ error: 'Too many chat requests. Please try again later.' });
    }

    bucket.count += 1;
    return next();
}

function validateMessage(message) {
    if (typeof message !== 'string') {
        return { error: 'Message must be a string.' };
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
        return { error: 'Message field is required.' };
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
        return { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` };
    }

    return { value: trimmedMessage };
}

// Middleware
app.use(cors({
    origin: corsOrigin,
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: REQUEST_BODY_LIMIT }));

// Initialize the official Gemini SDK using the server-side environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Proxy Route
app.post('/api/chat', rateLimitChat, async (req, res) => {
    try {
        const { message } = req.body || {};
        const validation = validateMessage(message);

        if (validation.error) {
            return res.status(400).json({ error: validation.error });
        }

        // Call the Gemini API securely from the backend
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Using standard cost-efficient flash model
            contents: validation.value,
        });

        // Return the clean text response to the client
        res.json({ reply: response.text });
    } catch (error) {
        console.error('Proxy Server Error:', error);
        res.status(500).json({ error: 'Failed to fetch response from AI model.' });
    }
});

app.use((error, req, res, next) => {
    if (error.statusCode === 403) {
        return res.status(403).json({ error: 'Origin is not allowed for this API.' });
    }

    if (error.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Request body is too large.' });
    }

    if (error instanceof SyntaxError && 'body' in error) {
        return res.status(400).json({ error: 'Invalid JSON request body.' });
    }

    return next(error);
});

app.listen(PORT, () => {
    console.log(`Secure Proxy Server running on http://localhost:${PORT}`);
});
