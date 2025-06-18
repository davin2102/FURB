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
mongoose.connect('mongodb+srv://User123:12345@cluster0.3fut4u7.mongodb.net/furb-items')
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

console.log("=== AI Backend STARTED ===");

// test
app.post("/test", (req, res) => {
  console.log("Test endpoint hit!");
  res.json({ ok: true });
});

// search
app.post("/search", async (req, res) => {
  mongoose.connection.db.collection('items').findOne({}, (err, doc) => {
    if (err) {
      console.error("Direct MongoDB error:", err);
      return res.status(500).json({ error: "Direct MongoDB error" });
    }
    console.log("Direct MongoDB doc:", doc);
    res.json({ doc });x
  });
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`AI backend running on http://localhost:${PORT}`);
});
