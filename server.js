// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST endpoint for chatbot
app.post("/chat", async (req, res) => {
  const { message, conversation } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    // Build messages array for context
    const messages = [
      { role: "system", content: "You are a helpful AI assistant helping students manage expenses and budget." },
      ...(conversation || []),
      { role: "user", content: message }
    ];

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 150
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "OpenAI API error" });
  }
});

// Use the port Render provides, fallback to 3000 locally
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
