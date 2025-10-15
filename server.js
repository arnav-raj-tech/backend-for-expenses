// server.js
// Fully ready for Render deployment (no .env needed)

import express from "express";
import cors from "cors";
import OpenAI from "openai";

// 1️⃣ Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// 2️⃣ Initialize OpenAI client with API key from Render environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing! Set it in Render environment variables.");
  process.exit(1); // Stop the server if the key is missing
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 3️⃣ Chat endpoint
app.post("/chat", async (req, res) => {
  const { message, conversation } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const messages = [
      {
        role: "system",
        content: "You are a helpful AI assistant helping students manage expenses and budgeting."
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

// 4️⃣ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
