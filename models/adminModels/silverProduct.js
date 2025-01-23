  const mongoose = require('mongoose');

  const SilverProductSchema = new mongoose.Schema({
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true, // name of product
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    details: {
      metalDetails: {
        // rate: { type: mongoose.Schema.Types.Mixed },
        weight: { type: mongoose.Schema.Types.Mixed },
        metal: {
          type: String,
          enum: ['Silver', 'Gold'], // Restrict to Silver
          required: true,
        },
        silverWeight: { type: String, default: 0 }, // For silver-specific weight
        stoneWeight: { type: String, default: 0 },
        stonePrice: { type: String, default: 0 },
        makingCharges: { type: Number, default: 0 },
        subtotal: { type: Number, default: 0 },
        gst: { type: Number, default: 0 },
        grandTotal: { type: Number, default: 0 },
      },
      generalDetails: {
        jewelleryType: { type: String, required: true },
        collection: { type: String },
        gender: { type: String, enum: ['Male', 'Female', 'Unisex'] },
        occasion: { type: String },
      },
    },
    description: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.model('SilverProduct', SilverProductSchema);
