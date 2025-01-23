const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, refPath: 'productType' },
  quantity: { type: Number, default: 1 },
  subtotal: { type: Number, default: 0 }, // Subtotal for this item in the cart
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [cartItemSchema], // List of products in the cart
  totalPrice: { type: Number, default: 0 }, // Total price of all items in the cart
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
