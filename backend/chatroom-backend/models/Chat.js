const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [String],
  messages: [{
    sender: String,
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  itemId: String,
  itemTitle: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);