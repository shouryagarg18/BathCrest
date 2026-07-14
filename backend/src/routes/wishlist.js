const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get wishlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price discountPrice images ratings numReviews slug stock');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add to wishlist
router.post('/add/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.wishlist.includes(req.params.productId)) {
      return res.json({ success: true, message: 'Already in wishlist', wishlist: user.wishlist });
    }
    user.wishlist.push(req.params.productId);
    await user.save();
    res.json({ success: true, message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Remove from wishlist
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.json({ success: true, message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle wishlist
router.post('/toggle/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.wishlist.indexOf(req.params.productId);
    let message;
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      message = 'Removed from wishlist';
    } else {
      user.wishlist.push(req.params.productId);
      message = 'Added to wishlist';
    }
    await user.save();
    res.json({ success: true, message, wishlist: user.wishlist, inWishlist: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
