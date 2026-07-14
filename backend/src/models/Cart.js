const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  discountPrice: Number,
  quantity: { type: Number, required: true, min: 1, default: 1 },
  stock: Number,
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  couponDiscount: { type: Number, default: 0 },
}, { timestamps: true });

cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((acc, item) => {
    const price = item.discountPrice || item.price;
    return acc + price * item.quantity;
  }, 0);
});

cartSchema.virtual('total').get(function () {
  return this.subtotal - this.couponDiscount;
});

module.exports = mongoose.model('Cart', cartSchema);
