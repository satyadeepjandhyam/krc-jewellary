// models/DiamondProduct.js
const mongoose = require('mongoose');

const diamondProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  diamondQuality: {
    type: String,
    enum: ['Excellent', 'Very Good', 'Good', 'Fair'],
    required: true,
  },
  metal: {
    type: String,
    enum: ['Platinum', 'Gold'],
    required: true,
  },
  carat: { type: Number, required: true },
  cut: {
    type: String,
    enum: ['Round', 'Princess', 'Emerald', 'Asscher', 'Cushion', 'Oval'],
    required: true,
  },
  color: {
    type: String,
    enum: ['D', 'E', 'F', 'G', 'H', 'I'],
    required: true,
  },
  clarity: {
    type: String,
    enum: ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'],
    required: true,
  },
  description: { type: String, required: true },
});

module.exports = mongoose.model('DiamondProduct', diamondProductSchema);
