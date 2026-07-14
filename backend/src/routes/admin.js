const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// Dashboard Stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueData] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    // Monthly revenue for chart
    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    const lowStock = await Product.find({ stock: { $lt: 10 } }).select('name stock sku').limit(10);
    const recentOrders = await Order.find().sort('-createdAt').limit(5).populate('user', 'name email');

    res.json({
      success: true,
      stats: { totalUsers, totalProducts, totalOrders, totalRevenue },
      monthlyRevenue,
      lowStock,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// All users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [users, total] = await Promise.all([
      User.find().sort('-createdAt').skip((page - 1) * limit).limit(Number(limit)),
      User.countDocuments(),
    ]);
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update user role
router.put('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
