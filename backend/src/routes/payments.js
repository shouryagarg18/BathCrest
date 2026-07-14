const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Create Stripe payment intent
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount, currency = 'inr' } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // in paise
      currency,
      metadata: { userId: req.user._id.toString() },
    });
    res.json({ success: true, clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (err) {
    // If Stripe key is test/invalid, simulate success for demo
    res.json({
      success: true,
      clientSecret: 'pi_test_demo_client_secret',
      paymentIntentId: 'pi_test_' + Date.now(),
      demo: true,
    });
  }
});

// Simulate payment success (for demo/COD/UPI)
router.post('/simulate-success', protect, async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentResult = {
      id: 'sim_' + Date.now(),
      status: 'succeeded',
      updateTime: new Date().toISOString(),
    };
    await order.save();
    res.json({ success: true, message: 'Payment confirmed', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Razorpay placeholder
router.post('/razorpay/create-order', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Razorpay integration placeholder',
    orderId: 'rzp_order_' + Date.now(),
    amount: req.body.amount,
    currency: 'INR',
    keyId: 'rzp_test_placeholder',
  });
});

// UPI placeholder
router.post('/upi/generate-qr', protect, (req, res) => {
  res.json({
    success: true,
    message: 'UPI QR Code placeholder',
    upiId: 'bathcrest@upi',
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=bathcrest@upi&pn=BathCrest&am=${req.body.amount}&cu=INR`,
    amount: req.body.amount,
  });
});

module.exports = router;
