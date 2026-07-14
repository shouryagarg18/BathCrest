const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
  sku: String,
});

const shippingAddressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: 'India' },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    enum: ['stripe', 'razorpay', 'upi', 'cod'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
    email: String,
  },
  itemsTotal: { type: Number, required: true },
  shippingPrice: { type: Number, default: 0 },
  taxPrice: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  coupon: String,
  orderStatus: {
    type: String,
    enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'processing',
  },
  deliveredAt: Date,
  estimatedDelivery: Date,
  trackingNumber: String,
  notes: String,
}, { timestamps: true });

// Auto-generate orderId
orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = 'BC' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    this.estimatedDelivery = deliveryDate;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
