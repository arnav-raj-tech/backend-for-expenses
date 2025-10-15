import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import express from "express";
import cors from "cors";
import OpenAI from "openai";

// Check if the API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing. Check your .env file!");
  process.exit(1); // Stop the server if key is missing
}

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST endpoint for chatbot
app.post("/chat", async (req, res) => {
  const { message, conversation } = req.body;

  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant helping students manage expenses and budget."
      },
      ...(conversation || []),
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 150
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: "OpenAI API error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
