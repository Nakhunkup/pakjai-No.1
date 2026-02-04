const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        console.log("------------------------------------------");
        console.log("Received request at /api/chat");

        let apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("API Key is MISSING in environment variables!");
            return res.status(500).json({ error: "Server Configuration Error: API Key missing" });
        }

        // Remove quotes if present just in case
        apiKey = apiKey.replace(/['"]+/g, '');

        const { model, prompt } = req.body;

        // Use gemini-1.5-flash as default, but ensure no 'models/' prefix duplication
        let effectiveModel = model || "gemini-1.5-flash";
        if (effectiveModel.startsWith("models/")) {
            effectiveModel = effectiveModel.substring(7);
        }

        console.log(`Using model: ${effectiveModel}`);

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${effectiveModel}:generateContent?key=${apiKey}`;

        console.log("Calling Google Gemini API...");
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        console.log("Google API Response Status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Google API Error Details:", errorData);
            const errorMessage = (errorData.error && errorData.error.message) || "Unknown API Error";
            return res.status(response.status).json({ error: errorMessage });
        }

        const data = await response.json();
        console.log("Success! Sending data back to client.");
        res.json(data);

    } catch (error) {
        console.error("Server Internal Error:", error);
        res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("Ready to accept requests");
});
