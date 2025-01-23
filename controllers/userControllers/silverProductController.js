const SilverProduct = require('../../models/adminModels/silverProduct');

// Fetch all silver products
const getAllSilverProducts = async (req, res) => {
    try {
        const products = await SilverProduct.find();
        return res.status(200).json({
            success: true,
            message: 'All silver products fetched successfully',
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// Fetch products by price range
const getProductsByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;

        const priceFilter = {};
        if (minPrice) priceFilter.$gte = parseFloat(minPrice);
        if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);

        const productsByPrice = await SilverProduct.find({ price: priceFilter });

        return res.status(200).json({
            success: true,
            message: 'Products by price fetched successfully',
            data: productsByPrice,
        });
    } catch (error) {
        console.error('Error fetching products by price:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Fetch products by collection
const getProductsByCollections = async (req, res) => {
    try {
        const collection = req.params.collection;
        const productsByCollection = await SilverProduct.find({ 'details.generalDetails.collection': collection });

        if (productsByCollection.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No products found for collection: ${collection}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Products by collection fetched successfully',
            data: productsByCollection,
        });
    } catch (error) {
        console.error('Error fetching products by collection:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Search products by name or description
const searchProducts = async (req, res) => {
    try {
        const query = req.query.q;
        const searchResults = await SilverProduct.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ],
        });

        return res.status(200).json({
            success: true,
            message: 'Search results fetched successfully',
            data: searchResults,
        });
    } catch (error) {
        console.error('Error searching products:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Fetch products by gender
const getProductsByGender = async (req, res) => {
    try {
        const gender = req.params.gender;
        const productsByGender = await SilverProduct.find({ 'details.generalDetails.gender': gender });

        if (productsByGender.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No products found for gender: ${gender}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Products by gender fetched successfully',
            data: productsByGender,
        });
    } catch (error) {
        console.error('Error fetching products by gender:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Fetch products by jewellery type
const getProductsByJewelleryType = async (req, res) => {
    try {
        const jewelleryType = req.params.jewelleryType.trim();
        const productsByType = await SilverProduct.find({
            'details.generalDetails.jewelleryType': {
                $regex: new RegExp(`^${jewelleryType}$`, 'i'),
            },
        });

        if (productsByType.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No products found for jewellery type: ${jewelleryType}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Products by jewellery type fetched successfully',
            data: productsByType,
        });
    } catch (error) {
        console.error('Error fetching products by jewellery type:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    
};

module.exports = {
    getAllSilverProducts,
    getProductsByPrice,
    getProductsByCollections,
    searchProducts,
    getProductsByGender,
    getProductsByJewelleryType,
};
