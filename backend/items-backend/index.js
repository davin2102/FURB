const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Item = require('./models/Item');
const SoldItem = require('./models/SoldItem'); // Add this line

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Item API is running!');
});

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://User123:12345@cluster0.3fut4u7.mongodb.net/furb-items')
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ITEMS ROUTES
app.post('/items', upload.single('image'), async (req, res) => {
  try {
    const item = new Item({
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      location: req.body.location,
      image: req.file ? req.file.filename : '',
      seller: req.body.seller
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    const itemsWithImageUrl = items.map(item => ({
      ...item._doc,
      imageUrl: item.image ? `http://localhost:5002/uploads/${item.image}` : ''
    }));
    res.json(itemsWithImageUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/items/search', async (req, res) => {
  try {
    const query = req.query.q;
    const items = await Item.find({
      title: { $regex: query, $options: 'i' }
    });
    const itemsWithImageUrl = items.map(item => ({
      ...item._doc,
      imageUrl: item.image ? `http://localhost:5002/uploads/${item.image}` : ''
    }));
    res.json(itemsWithImageUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    const imageUrl = item.image ? `http://localhost:5002/uploads/${item.image}` : '';
    res.json({ ...item._doc, imageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SOLD ITEMS ROUTES
app.get('/sold-items', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    
    const soldItems = await SoldItem.find({ seller: email });
    const itemsWithImageUrl = soldItems.map(item => ({
      ...item._doc,
      imageUrl: item.image ? `http://localhost:5002/uploads/${item.image}` : ''
    }));
    res.json(itemsWithImageUrl);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/sold-items', async (req, res) => {
  try {
    const soldItem = new SoldItem({
      title: req.body.title,
      description: req.body.description || '',
      price: req.body.price || 0,
      location: req.body.location || '',
      image: req.body.image || '',
      seller: req.body.seller,
      soldDate: new Date()
    });
    await soldItem.save();
    res.status(201).json(soldItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Item server is running on http://localhost:${PORT}`);
});