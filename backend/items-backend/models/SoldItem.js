const mongoose = require('mongoose');

const soldItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  location: String,
  image: String,
  seller: { type: String, required: true },
  soldDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SoldItem', soldItemSchema);