const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const OpenAI = require("openai");
require("dotenv").config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Replace with your actual connection string
const uri =
  "mongodb+srv://User123:12345@cluster0.3fut4u7.mongodb.net/furb-items?retryWrites=true&w=majority";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB ONCE
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected (minimal AI backend)"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a minimal Item model
const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  location: String,
  seller: String,
  createdAt: Date,
});
const Item = mongoose.model("Item", itemSchema);

// Test root endpoint
app.get("/", (req, res) => {
  res.send("✅ Minimal AI Backend is working!");
});

// Test /search endpoint
app.post('/search', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });
  try {
    const items = await Item.find().limit(10);
    const results = [];
    for (const item of items) {
      const itemText = `${item.title}. ${item.description}`;
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4.1",
          messages: [
            { role: "system", content: "You help users find furniture." },
            { role: "user", content: `Prompt: ${prompt}. Item: ${itemText}. Is this a match? Reply yes or no, and explain why in one sentence.` },
          ],
        });
        const reply = response.choices[0].message.content;
        console.log({ prompt, itemText, reply });
        if (reply.toLowerCase().includes("yes")) {
          results.push(item);
        }
      } catch (err) {
        console.error("AI error:", err);
      }
    }
    res.json(results);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = 5010;
app.listen(PORT, () => {
  console.log(`Minimal AI backend running on http://localhost:${PORT}`);
});
