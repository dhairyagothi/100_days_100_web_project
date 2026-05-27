// server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from your frontend origin
app.use(express.json());

// Initialize the official Gemini SDK using the server-side environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Proxy Route
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message field is required.' });
        }

        // Call the Gemini API securely from the backend
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Using standard cost-efficient flash model
            contents: message,
        });

        // Return the clean text response to the client
        res.json({ reply: response.text });
    } catch (error) {
        console.error('Proxy Server Error:', error);
        res.status(500).json({ error: 'Failed to fetch response from AI model.' });
    }
});

app.listen(PORT, () => {
    console.log(`Secure Proxy Server running on http://localhost:${PORT}`);
});