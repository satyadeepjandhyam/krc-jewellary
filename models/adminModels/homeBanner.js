// const mongoose = require("mongoose");

// const homeBannerSchema = new mongoose.Schema({
//   bannerImage: { type: String, required: true }
// });

// module.exports = mongoose.model("HomeBanner", homeBannerSchema);
const mongoose = require('mongoose');

const homeBannerSchema = new mongoose.Schema({
  bannerImage: { 
    type: Buffer, // Binary data for the image (Blob)
    required: true 
  }
});

module.exports = mongoose.model('HomeBanner', homeBannerSchema);