const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const mongoose = require("mongoose");
const Item = require("../items-backend/models/Item");

// ====== CONFIG ======
require("dotenv").config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ====== MONGODB CONNECTION ======
// You may want to use the same connection string as items-backend
mongoose
  .connect(
    "mongodb+srv://User123:12345@cluster0.3fut4u7.mongodb.net/furb-items"
  )
  .then(() => console.log("MongoDB Atlas connected (AI backend)"))
  .catch((err) => console.error("MongoDB connection error (AI backend):", err));

// ====== EXPRESS APP ======
const app = express();
app.use(cors());
app.use(express.json());

// ====== ROUTES ======

// Test route
app.get("/", (req, res) => {
  res.send("✅ AI Backend is working!");
});

// AI-powered furniture search
app.post("/search", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  let items;
  try {
    items = await Item.find().limit(10);
  } catch (err) {
    return res.status(500).json({ error: "Database error" });
  }

  const results = [];
  for (const item of items) {
    const imageUrl = `http://localhost:5002/uploads/${item.image}`;
    const itemText = `${item.title}. ${item.description}. Image URL: ${imageUrl}`;
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You help users find furniture. You can also use the image URL as a reference for the item's appearance.",
          },
          {
            role: "user",
            content: `Prompt: ${prompt}. Item: ${itemText}. Is this a match? Reply yes or no, and explain why in one sentence.`,
          },
        ],
      });
      const reply = response.choices[0].message.content;
      console.log({ prompt, itemText, reply });
      if (reply.toLowerCase().includes("yes")) {
        results.push({ ...item._doc, imageUrl });
      }
    } catch (err) {
      // Optionally log error
      console.error("AI error:", err);
    }
  }
  res.json(results);
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`AI backend running on http://localhost:${PORT}`);
});
