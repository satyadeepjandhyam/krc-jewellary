const mongoose = require('mongoose');

const goldRateSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true }, 
    rate22Carat: { type: Number, required: true },
    rate24Carat: { type: Number, required: true },
    rate18Carat: { type: Number, required: true },
    // change22Carat: { type: Number, default: 0 }, 
    // change24Carat: { type: Number, default: 0 }, 
    // change18Carat: { type: Number, default: 0 }, 
}, { timestamps: true });

module.exports = mongoose.model('GoldRate', goldRateSchema);
