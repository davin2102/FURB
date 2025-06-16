const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require('mongoose');
const axios = require('axios'); // Add at the top if not already

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

// Add mongoose connection
mongoose.connect('mongodb+srv://User123:12345@cluster0.3fut4u7.mongodb.net/furb-chats')
  .then(() => console.log('MongoDB connected for chat'))
  .catch(err => console.error('MongoDB connection error:', err));

let messages = [];
let onlineUsers = {};
let persistentUserList = new Set(); 

// --- NEW API ENDPOINT ---
// This endpoint returns every user who has ever registered.
app.get("/api/all-users", async (req, res) => {
  try {
    // persistentUserList contains emails/usernames
    const users = Array.from(persistentUserList);
    // Fetch user profiles from login-backend
    const profiles = await Promise.all(users.map(async (email) => {
      try {
        const resp = await axios.get(`http://localhost:5000/profile?email=${encodeURIComponent(email)}`);
        const firstName = resp.data.firstName || "";
        const lastName = resp.data.lastName || "";
        let name = (firstName + " " + lastName).trim();
        if (!name) name = email.split('@')[0];
        return {
          email,
          name
        };
      } catch {
        return { email, name: email.split('@')[0] };
      }
    }));
    res.json(profiles);
  } catch (err) {
    res.json(users.map(email => ({ email, name: email.split('@')[0] })));
  }
});

app.get('/messages', (req, res) => {
  const { user1, user2 } = req.query;

  if (user1 && user2) {
    const conversationHistory = messages.filter(msg =>
      (msg.user === user1 && msg.to === user2) ||
      (msg.user === user2 && msg.to === user1)
    );
    return res.json(conversationHistory);
  }

  if (user1) {
    const allUserMessages = messages.filter(msg =>
      msg.user === user1 || msg.to === user1
    );
    return res.json(allUserMessages);
  }
  return res.json([]);
});

// Add this route to handle chat creation
app.post('/createChat', async (req, res) => {
  try {
    const { sender, receiver, itemId, itemTitle } = req.body;
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      $or: [
        { participants: [sender, receiver] },
        { participants: [receiver, sender] }
      ],
      itemId: itemId
    });

    // If no chat exists, create a new one
    if (!chat) {
      chat = new Chat({
        participants: [sender, receiver],
        messages: [],
        itemId: itemId,
        itemTitle: itemTitle
      });
      await chat.save();
    }

    res.json({ 
      chatId: chat._id,
      message: 'Chat created/found successfully' 
    });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Add this new endpoint
app.post('/chats/create', async (req, res) => {
  try {
    const { sender, receiver, itemId, itemTitle } = req.body;
    
    // Check if chat already exists for this item between these users
    let chat = await Chat.findOne({
      participants: { $all: [sender, receiver] },
      itemId: itemId
    });

    // If no chat exists, create a new one
    if (!chat) {
      chat = new Chat({
        participants: [sender, receiver],
        messages: [],
        itemId: itemId,
        itemTitle: itemTitle
      });
      await chat.save();
    }

    res.json({ 
      chatId: chat._id,
      message: 'Chat created successfully' 
    });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

io.on("connection", (socket) => {
  let currentUsername = null;

  socket.on("register", (name) => {
    currentUsername = name;
    onlineUsers[socket.id] = currentUsername;
    persistentUserList.add(currentUsername);
    io.emit("online-users", Object.values(onlineUsers));

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
      io.emit("online-users", Object.values(onlineUsers));
      console.log("User disconnected:", currentUsername);
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Chatroom backend running on http://localhost:${PORT}`);
});
