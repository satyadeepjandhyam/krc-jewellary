const mongoose = require('mongoose');

// Testimonial schema
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
