const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const Item = require('./models/Item');

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
    cb(null, 'uploads/'); // Store uploaded files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file to avoid conflicts
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://User123:12345@cluster0.3fut4u7.mongodb.net/furb-items')
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Add item
app.post('/items', upload.single('image'), async (req, res) => {
  console.log('req.file:', req.file);
  console.log('req.body:', req.body);
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
    console.error('Error saving item:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    const itemsWithImageUrl = items.map(item => ({
      ...item._doc,
      imageUrl: `http://localhost:5002/uploads/${item.image}`
    }));
    res.json(itemsWithImageUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search items
app.get('/items/search', async (req, res) => {
  try {
    const query = req.query.q;
    const items = await Item.find({
      title: { $regex: query, $options: 'i' }
    });
    const itemsWithImageUrl = items.map(item => ({
      ...item._doc,
      imageUrl: `http://localhost:5002/uploads/${item.image}`
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
    const imageUrl = `http://localhost:5002/uploads/${item.image}`;
    res.json({ ...item._doc, imageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Item server is running on http://localhost:${PORT}`);
})
