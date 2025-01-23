const SilverRate = require('../../models/adminModels/silverRate');
const Product = require('../../models/adminModels/silverProduct');

// Render Silver Rates page
exports.getSilverRates = async (req, res) => {
    try {
        const silverRates = await SilverRate.find().sort({ date: -1 });
        res.render('silverRates', { 
            silverRates, 
            editRate: null, 
            success: req.flash('success'), 
            error: req.flash('error') 
        });
    } catch (err) {
        console.error('Error fetching silver rates:', err);
        res.render('silverRates', { 
            silverRates: [], 
            editRate: null, 
            success: null, 
            error: 'Failed to fetch silver rates' 
        });
    }
};

// Add a new Silver Rate
exports.addSilverRate = async (req, res) => {
    try {
        const { date, rate } = req.body;

        // Validate required fields
        if (!date || !rate || isNaN(rate) || parseFloat(rate) <= 0) {
            req.flash('error', 'Valid date and silver rate are required');
            return res.redirect('/auth/silverRates');
        }

        // Check if the rate already exists for the same date
        const existingRate = await SilverRate.findOne({ date });
        if (existingRate) {
            req.flash('error', 'Silver rate already exists for this date');
            return res.redirect('/auth/silverRates');
        }

        // Create and save the new silver rate
        const newSilverRate = new SilverRate({ date, rate: parseFloat(rate) });
        await newSilverRate.save();

        // Update product prices based on the new silver rate
        await updateSilverProductPrices(newSilverRate);

        req.flash('success', 'Silver rate added successfully');
        return res.redirect('/auth/silverRates');
    } catch (error) {
        console.error('Error adding silver rate:', error);
        req.flash('error', 'Internal server error');
        return res.redirect('/auth/silverRates');
    }
};

// Update product prices based on the latest silver rate
const updateSilverProductPrices = async (silverRate) => {
    try {
        const products = await Product.find();

        for (const product of products) {
            const productName = product.name || 'Unnamed product';

            // Validate and parse weight
            const weight = parseFloat(product.details.metalDetails.weight);
            if (isNaN(weight) || weight <= 0) {
                console.warn(`Invalid weight for product: ${productName}`);
                continue;
            }

            // Calculate base price
            const calculatedPrice = silverRate.rate * 0.1 * weight;
            if (isNaN(calculatedPrice) || calculatedPrice <= 0) {
                console.warn(`Invalid price calculation for product: ${productName}`);
                continue;
            }

            // Calculate stone price if applicable
            const stoneWeight = parseFloat(product.details.stoneDetails?.stoneWeight) || 0;
            const stonePrice = parseFloat(product.details.stoneDetails?.stonePrice) || 0;

            const calculatedStonePrice = stoneWeight > 0 ? stoneWeight * silverRate.rate : 0;

            // Calculate subtotal
            const makingCharges = parseFloat(product.details.metalDetails.makingCharges) || 0;
            const subtotal = calculatedPrice + stonePrice - calculatedStonePrice + makingCharges;

            // Calculate GST and grand total
            const gst = parseFloat(product.details.metalDetails.gst) || 0;
            const grandTotal = subtotal + gst;

            // Update product details
            product.price = calculatedPrice;
            product.details.metalDetails.subtotal = subtotal;
            product.details.metalDetails.grandTotal = grandTotal;

            await product.save();
        }

        console.log('All silver products updated with the latest rates.');
    } catch (error) {
        console.error('Error updating silver products:', error);
    }
};

// Delete a Silver Rate
exports.deleteSilverRate = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSilverRate = await SilverRate.findByIdAndDelete(id);
        if (!deletedSilverRate) {
            req.flash('error', 'Silver rate not found');
            return res.redirect('/auth/silverRates');
        }

        // Update product prices with the latest silver rate if it exists
        const latestSilverRate = await SilverRate.findOne().sort({ date: -1 });
        if (latestSilverRate) {
            await updateSilverProductPrices(latestSilverRate);
        }

        req.flash('success', 'Silver rate deleted successfully');
        return res.redirect('/auth/silverRates');
    } catch (error) {
        console.error('Error deleting silver rate:', error);
        req.flash('error', 'Internal server error');
        return res.redirect('/auth/silverRates');
    }
};
