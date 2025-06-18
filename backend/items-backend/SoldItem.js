const express = require('express');
const router = express.Router();
const SoldItem = require('../models/SoldItem'); // Make sure this path is correct

// GET sold items for a user
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const soldItems = await SoldItem.find({ seller: email });
    res.json(soldItems);
  } catch (err) {
    console.error('Error fetching sold items:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST new sold item
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.seller) {
      return res.status(400).json({ message: 'Title and seller are required' });
    }

    const soldItem = new SoldItem({
      title: req.body.title,
      description: req.body.description || '',
      price: req.body.price || 0,
      location: req.body.location || '',
      imageUrl: req.body.imageUrl || '',
      seller: req.body.seller,
      soldDate: new Date()
    });

    await soldItem.save();
    res.status(201).json(soldItem);
  } catch (err) {
    console.error('Error creating sold item:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;