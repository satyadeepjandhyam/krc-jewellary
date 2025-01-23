const DiamondProduct = require('../../models/adminModels/diamondProduct');

// Fetch all diamond products
exports.getDiamondProducts = async (req, res) => {
  try {
    const products = await DiamondProduct.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error fetching diamond products:', error);
    res.status(500).json({ success: false, message: 'Error fetching diamond products' });
  }
};

// Fetch products by metal type
exports.getProductsByMetal = async (req, res) => {
  try {
    const { metal } = req.params;
    const products = await DiamondProduct.find({ metal: metal });
    
    if (!products.length) {
      return res.status(404).json({ success: false, message: 'No products found for the specified metal type' });
    }
    
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products by metal:', error);
    res.status(500).json({ success: false, message: 'Error fetching products by metal' });
  }
};

// Fetch products within a price range
exports.getProductsByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    // Ensure price range values are provided
    if (!minPrice || !maxPrice) {
      return res.status(400).json({ success: false, message: 'Please provide minPrice and maxPrice' });
    }

    // Fetch products within the price range
    const products = await DiamondProduct.find({
      price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
    });

    if (!products.length) {
      return res.status(404).json({ success: false, message: 'No products found within the specified price range' });
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products by price range:', error);
    res.status(500).json({ success: false, message: 'Error fetching products by price range' });
  }
};
