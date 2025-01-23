const GoldRate = require('../../models/adminModels/goldRate');
const Product = require('../../models/adminModels/product');

// Add a new gold rate and update the product prices
exports.addGoldRate = async (req, res) => {
    try {
        const { date, rate22Carat, rate24Carat, rate18Carat } = req.body;

        // Validate required fields
        if (!date || !rate22Carat || !rate24Carat || !rate18Carat) {
            req.flash('error', 'Date and all rates are required');
            return res.redirect('/auth/goldRates');
        }

        // Check if the rate already exists for the same date
        const existingRate = await GoldRate.findOne({ date });
        if (existingRate) {
            req.flash('error', 'Gold rate already exists for this date');
            return res.redirect('/auth/goldRates');
        }

        // Create and save the new gold rate
        const newGoldRate = new GoldRate({
            date,
            rate22Carat,
            rate24Carat,
            rate18Carat,
        });

        await newGoldRate.save();

        // Update product prices based on the new gold rate
        await updateProductPrices(newGoldRate);

        req.flash('success', 'Gold rate added successfully');
        return res.redirect('/auth/goldRates');
    } catch (error) {
        console.error('Error adding gold rate:', error);
        req.flash('error', 'Internal server error');
        return res.redirect('/auth/goldRates');
    }
};

// Update an existing gold rate and update the product prices
exports.updateGoldRate = async (req, res) => {
    try {
        const { id, date, rate22Carat, rate24Carat, rate18Carat } = req.body;

        // Validate required fields
        if (!date || !rate22Carat || !rate24Carat || !rate18Carat) {
            req.flash('error', 'Date and all rates are required');
            return res.redirect(`/auth/editGoldRate/${id}`);
        }

        // Find and update the gold rate
        const updatedGoldRate = await GoldRate.findByIdAndUpdate(id, {
            date,
            rate22Carat,
            rate24Carat,
            rate18Carat,
        }, { new: true });

        if (!updatedGoldRate) {
            req.flash('error', 'Gold rate not found');
            return res.redirect('/auth/goldRates');
        }

        // Recalculate the prices of products based on the updated gold rate
        await updateProductPrices(updatedGoldRate);

        req.flash('success', 'Gold rate updated successfully');
        return res.redirect('/auth/goldRates');
    } catch (error) {
        console.error('Error updating gold rate:', error);
        req.flash('error', 'Internal server error');
        return res.redirect('/auth/goldRates');
    }
};

// Delete an existing gold rate and update the product prices
exports.deleteGoldRate = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the gold rate
        const deletedGoldRate = await GoldRate.findByIdAndDelete(id);

        if (!deletedGoldRate) {
            req.flash('error', 'Gold rate not found');
            return res.redirect('/auth/goldRates');
        }

        // After deleting the rate, update product prices (either revert to the previous rate or leave them unchanged)
        const latestGoldRate = await GoldRate.findOne().sort({ date: -1 });
        if (latestGoldRate) {
            await updateProductPrices(latestGoldRate);
        }

        req.flash('success', 'Gold rate deleted successfully');
        return res.redirect('/auth/goldRates');
    } catch (error) {
        console.error('Error deleting gold rate:', error);
        req.flash('error', 'Internal server error');
        return res.redirect('/auth/goldRates');
    }
};
// Helper function to update product prices based on the latest gold rate
const updateProductPrices = async (goldRate) => {
    try {
        const products = await Product.find();

        for (const product of products) {
            const productName = product.name || "Unnamed product";

            const parsedWeight = parseFloat(product.details.metalDetails.weight);
            if (isNaN(parsedWeight) || parsedWeight <= 0) {
                console.log(`Invalid weight for product: ${productName}`);
                continue; // Skip this product if the weight is invalid
            }

            let karatRate;
            const productKarat = product.details.metalDetails.karats;
            const stoneWeight = parseFloat(product.details.metalDetails.stoneWeight) || 0;

            console.log("Product Karat:", productKarat);

            // Determine the karat rate for the product
            if (productKarat === "22k") {
                karatRate = goldRate.rate22Carat * parsedWeight;
            } else if (productKarat === "24k") {
                karatRate = goldRate.rate24Carat * parsedWeight;
            } else if (productKarat === "18k") {
                karatRate = goldRate.rate18Carat * parsedWeight;
            } else {
                console.log(`Invalid gold type for product: ${productName}, Karat: ${productKarat}`);
                continue;
            }

            // Calculate the new price based on the weight and karat rate
            const calculatedPrice = karatRate;
            console.log("Parsed Weight:", parsedWeight);
            console.log("Karat Rate:", karatRate);
            console.log("Calculated Price:", calculatedPrice);

            if (isNaN(calculatedPrice) || calculatedPrice <= 0) {
                console.log(`Invalid price calculation for product: ${productName}`);
                continue; // Skip this product if the price is invalid
            }

            // Calculate stone price dynamically
            const parsedStoneWeight = parseFloat(stoneWeight);
            console.log("Parsed Stone Weight:", parsedStoneWeight);

            let calculatedStonePrice;
            if (productKarat === "22k") {
                calculatedStonePrice = parsedStoneWeight * goldRate.rate22Carat;
            } else if (productKarat === "24k") {
                calculatedStonePrice = parsedStoneWeight * goldRate.rate24Carat;
            } else if (productKarat === "18k") {
                calculatedStonePrice = parsedStoneWeight * goldRate.rate18Carat;
            } else {
                calculatedStonePrice = 0; // Default to 0 if karats are invalid
            }
            console.log("Calculated Stone Price:", calculatedStonePrice);

            // Parse additional fields
            const parsedStonePrice = parseFloat(product.details.metalDetails.stonePrice) || 0;
            const parsedMakingCharges = parseFloat(product.details.metalDetails.makingCharges) || 0;

            console.log("Parsed Stone Price:", parsedStonePrice);
            console.log("Parsed Making Charges:", parsedMakingCharges);

            // Calculate subtotal
            const subtotal = calculatedPrice - calculatedStonePrice + parsedStonePrice + parsedMakingCharges;
            console.log("Subtotal:", subtotal);

            // Parse GST and calculate grand total
            const parsedGst = parseFloat(product.details.metalDetails.gst) || 0;
            console.log("Parsed GST:", parsedGst);

            const grandTotal = subtotal + parsedGst;
            console.log("Grand Total:", grandTotal);

            // Update product details
            product.price = calculatedPrice;
            product.details.metalDetails.stonePrice = parsedStonePrice;
            product.details.metalDetails.makingCharges = parsedMakingCharges;
            product.details.metalDetails.subtotal = subtotal;
            product.details.metalDetails.grandTotal = grandTotal;

            // Save the updated product
            await product.save();

            console.log("Product updated:", productName);
        }

        console.log('All products updated with the latest gold rates.');
    } catch (error) {
        console.error('Error updating products:', error);
    }
};


// Controller function for viewing the gold rate history
exports.getGoldRatesHistory = async (req, res) => {
    try {
        const rates = await GoldRate.find().sort({ date: -1 });
        return res.render('goldRateHistory', {
            success: req.flash('success'),
            error: req.flash('error'),
            rates: rates,
        });
    } catch (error) {
        console.error('Error fetching gold rates history:', error);
        req.flash('error', 'Internal server error');
        return res.redirect('/auth/goldRates');
    }
};
