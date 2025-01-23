const mongoose = require('mongoose');

const silverRateSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    rate: { type: Number, required: true },
    change: { type: Number, default: 0 }, 
}, { timestamps: true });

module.exports = mongoose.model('SilverRate', silverRateSchema);
