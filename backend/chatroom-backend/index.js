// index.js (Updated)

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// --- MODIFIED USER STORAGE ---
let messages = [];
let onlineUsers = {}; // Tracks currently connected users (socket.id -> username)
let persistentUserList = new Set(); // Stores ALL users who have ever joined

// --- NEW API ENDPOINT ---
// This endpoint returns every user who has ever registered.
app.get("/api/all-users", (req, res) => {
  res.json(Array.from(persistentUserList));
});

app.get("/messages", (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) return res.json([]);
  const conversationHistory = messages.filter(
    (msg) =>
      (msg.user === user1 && msg.to === user2) ||
      (msg.user === user2 && msg.to === user1)
  );
  res.json(conversationHistory);
});

io.on("connection", (socket) => {
  let currentUsername = null;

  socket.on("register", (name) => {
    currentUsername = name;
    onlineUsers[socket.id] = currentUsername;

    // Add the user to our persistent list and broadcast the new online list
    persistentUserList.add(currentUsername);
    io.emit("online-users", Object.values(onlineUsers)); // Broadcast only the list of who is online

    console.log("User registered:", name);
  });

  socket.on("private message", (msg) => {
    const message = { id: Date.now(), timestamp: new Date(), ...msg };
    messages.push(message);
    const recipientSocketId = Object.keys(onlineUsers).find(
      (key) => onlineUsers[key] === msg.to
    );
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("chat message", message);
    }
    socket.emit("chat message", message);
  });

  socket.on("disconnect", () => {
    if (currentUsername) {
      delete onlineUsers[socket.id];
      // Broadcast the updated list of who is still online
      io.emit("online-users", Object.values(onlineUsers));
      console.log("User disconnected:", currentUsername);
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Chatroom backend running on http://localhost:${PORT}`);
});
