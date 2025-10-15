// server.js

import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// --- Check if API key is present ---
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY in .env file!");
  process.exit(1);
}

// --- Initialize OpenAI Client ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Chat Endpoint ---
app.post("/chat", async (req, res) => {
  const { message, conversation } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const messages = [
      {
        role: "system",
        content:
          "You are ExpenseAI — a friendly chatbot that helps students manage expenses, save money, and plan budgets smartly.",
      },
      ...(conversation || []),
      { role: "user", content: message },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and affordable model
      messages,
      max_tokens: 150,
      temperature: 0.8,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("🔥 OpenAI API Error:", error);
    res.status(500).json({ error: "OpenAI API error" });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
