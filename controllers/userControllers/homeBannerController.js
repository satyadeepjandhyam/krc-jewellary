const HomeBanner = require('../../models/adminModels/homeBanner');

// Create Home Banner
exports.createBanner = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const newBanner = new HomeBanner({ imageUrl });
    await newBanner.save();
    res.status(201).json({ message: "Banner created successfully", newBanner });
  } catch (error) {
    res.status(400).json({ message: "Error creating banner", error });
  }
};

// Get All Banners (Retrieve all banner data)
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await HomeBanner.find(); // Fetch all banners
    const bannerCount = await HomeBanner.countDocuments(); // Get the count of banners
    
    if (!banners || banners.length === 0) {
      return res.status(404).json({ message: "No banners found" });
    }
    res.status(200).json({
      count: bannerCount, 
      banners,
        });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving banners", error });
  }
};

  

// Delete Home Banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await HomeBanner.findOneAndDelete();
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting banner", error });
  }
};
