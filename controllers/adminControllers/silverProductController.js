const SilverProduct = require("../../models/adminModels/silverProduct.js");
const SilverRate = require("../../models/adminModels/silverRate.js")
const { handleFileUpload, deleteFile } = require("../../middleWares/jwtUtils.js");

module.exports = {
    // Fetch all silver products
    allSilverProducts: async (req, res) => {
        try {
            const products = await SilverProduct.find().sort({ createdAt: -1 });
            console.log("products", products);

            return res.render("allSilverProducts", {

                products: products,
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.error("Error fetching silver products:", error);
            req.flash("error", "Internal server error");
            return res.redirect("/auth/admin/dashboard");
        }
    },

    // View a single silver product
    singleSilverProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            if (!productId) {
                req.flash("error", "Invalid product Id");
                return res.redirect("/auth/allsilverproducts");
            }
            const product = await SilverProduct.findById(productId);
            if (!product) {
                req.flash("error", "Product not found");
                return res.redirect("/auth/allsilverproducts");
            }
            return res.render("singleSilverProduct", {
                product: product,
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.error("Error fetching product details:", error);
            req.flash("error", "Internal server error");
            return res.redirect("/auth/admin/dashboard");
        }
    },

    // Render the add product page
    addSilverProductPage: (req, res) => {
        try {
            return res.render("addSilverProduct", {
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.error("Error rendering add product page:", error);
            req.flash("error", "Internal server error");
            return res.redirect("/auth/allsilverproducts");
        }
    },

    addSilverProduct: async (req, res) => {
        try {
            const {
                name,
                category,
                description,
                'details.metalDetails.weight': weight,
                'details.metalDetails.metal': metal = "Silver",
                'details.metalDetails.silverWeight': silverWeight,
                'details.metalDetails.makingCharges': makingCharges,
                'details.metalDetails.stoneWeight': stoneWeight,
                'details.metalDetails.stonePrice': stonePrice,
                'details.metalDetails.gst': gst,
                'details.generalDetails.jewelleryType': jewelleryType,
                'details.generalDetails.gender': gender,
                'details.generalDetails.collection': collection,
                'details.generalDetails.occasion': occasion,
            } = req.body;

            // Fetch the most recent silver rate
            const silverRate = await SilverRate.findOne().sort({ date: -1 });
            if (!silverRate) {
                req.flash("error", "Please add silver rate first");
                return res.redirect("/auth/allsilverproducts");
            }

            // Extract the rate from the fetched silverRate document
            const rate = silverRate.rate;

            // Parse and validate the weight
            const parsedWeight = parseFloat(weight);
            if (isNaN(parsedWeight)) {
                req.flash("error", "Invalid weight");
                return res.redirect("/auth/addProduct");
            }

            // Calculate the product price based on the rate and weight
            let calculatedPrice = rate * 0.1 * parsedWeight;
            console.log("rate", rate);
            console.log("calculatedPrice", calculatedPrice);

            if (isNaN(calculatedPrice)) {
                req.flash("error", "Calculated price is invalid");
                return res.redirect("/auth/addProduct");
            }

            // Parse and calculate the stone price if stone weight is provided
            const parsedStoneWeight = parseFloat(stoneWeight);
            const calculatedStonePrice = isNaN(parsedStoneWeight) ? 0 : parsedStoneWeight * 0.1 * rate;

            console.log("calculatedStonePrice", calculatedStonePrice);

            // Parse the other details (stonePrice, makingCharges, gst)
            const parsedStonePrice = parseFloat(stonePrice) || 0;
            const parsedMakingCharges = parseFloat(makingCharges) || 0;
            const parsedGst = parseFloat(gst) || 0;

            // Calculate subtotal and grand total
            const subtotal = calculatedPrice - calculatedStonePrice + parsedStonePrice + parsedMakingCharges;
            console.log("subtotal", subtotal);

            const grandTotal = subtotal + parsedGst;
            console.log("grandTotal", grandTotal);

            // Handle file upload for the product image
            const image = req.files ? req.files.productImage : null;
            if (!image) {
                req.flash("error", "Product image is required");
                return res.redirect("/auth/addSilverProduct");
            }

            const imagePath = await handleFileUpload(image, "silverProductPictures");

            // Create the new silver product document
            const newSilverProduct = await SilverProduct.create({
                image: imagePath,
                name,
                category,
                price: calculatedPrice,
                description,
                details: {
                    metalDetails: {
                        weight,
                        metal,
                        silverWeight,
                        stoneWeight,
                        stonePrice,
                        makingCharges,
                        subtotal,
                        gst: parsedGst,
                        grandTotal,
                    },
                    generalDetails: {
                        jewelleryType,
                        gender,
                        collection,
                        occasion,
                    },
                },
            });

            if (!newSilverProduct) {
                req.flash("error", "Error while adding the product");
                return res.redirect("/auth/addSilverProduct");
            }

            req.flash("success", "Silver product added successfully");
            return res.redirect("/auth/allsilverproducts");
        } catch (error) {
            console.error("Error adding silver product:", error);
            req.flash("error", "Internal server error");
            return res.redirect("/auth/addSilverProduct");
        }
    },

    updateSilverProduct: async (req, res) => {
        try {
            const productId = req.params.id;
    
            // Validate product ID
            if (!productId) {
                req.flash("error", "Invalid product ID");
                return res.redirect("/auth/allsilverproducts");
            }
    
            // Fetch the silver product by ID
            const productExists = await SilverProduct.findById(productId);
            if (!productExists) {
                req.flash("error", "Silver product not found");
                return res.redirect("/auth/allsilverproducts");
            }
    
            // Destructure fields from request body
            const {
                name,
                category,
                description,
                'details.metalDetails.weight': weight,
                'details.metalDetails.stoneWeight': stoneWeight,
                'details.metalDetails.stonePrice': stonePrice,
                'details.metalDetails.makingCharges': makingCharges,
                'details.metalDetails.gst': gst,
                'details.generalDetails.jewelleryType': jewelleryType,
                'details.generalDetails.gender': gender,
                'details.generalDetails.collection': collection,
                'details.generalDetails.occasion': occasion,
            } = req.body;
    
            // Fetch the most recent silver rate
            const silverRate = await SilverRate.findOne().sort({ date: -1 });
            if (!silverRate) {
                req.flash("error", "Please add silver rate first");
                return res.redirect(`/auth/singlesilverproduct/${productId}`);
            }
    
            const rate = silverRate.rate;
    
            // Log all fields for debugging
            console.log("Incoming data:", req.body);
            console.log("Silver Rate:", rate);
    
            // Parse and validate the weight
            const parsedWeight = parseFloat(weight) || productExists.details.metalDetails.weight;
            const parsedStoneWeight = parseFloat(stoneWeight) || productExists.details.metalDetails.stoneWeight;
            const parsedStonePrice = parseFloat(stonePrice) || productExists.details.metalDetails.stonePrice;
            const parsedMakingCharges = parseFloat(makingCharges) || productExists.details.metalDetails.makingCharges;
            const parsedGst = parseFloat(gst) || productExists.details.metalDetails.gst;
    
            // Log parsed values
            console.log("Parsed Weight:", parsedWeight);
            console.log("Parsed Stone Weight:", parsedStoneWeight);
            console.log("Parsed Stone Price:", parsedStonePrice);
            console.log("Parsed Making Charges:", parsedMakingCharges);
            console.log("Parsed GST:", parsedGst);
    
            // Calculate prices
            const calculatedPrice = rate * 0.1 * parsedWeight;
            const calculatedStonePrice = isNaN(parsedStoneWeight) ? 0 : parsedStoneWeight * 0.1 * rate;
            const subtotal = calculatedPrice - calculatedStonePrice + parsedStonePrice + parsedMakingCharges;
            const grandTotal = subtotal + parsedGst;
    
            // Log calculated values
            console.log("Calculated Price:", calculatedPrice);
            console.log("Calculated Stone Price:", calculatedStonePrice);
            console.log("Subtotal:", subtotal);
            console.log("Grand Total:", grandTotal);
    
            // Handle product image
            const productImage = req.files ? req.files.productImage : null;
            if (productImage) {
                if (productExists.image) {
                    await deleteFile(productExists.image);
                }
                const productImagePath = await handleFileUpload(productImage, "silverProductPictures");
                productExists.image = productImagePath;
            }
    
            // Update product fields
            productExists.name = name || productExists.name;
            productExists.category = category || productExists.category;
            productExists.description = description || productExists.description;
    
            // Ensure nested objects exist
            if (!productExists.details) productExists.details = {};
            if (!productExists.details.metalDetails) productExists.details.metalDetails = {};
            if (!productExists.details.generalDetails) productExists.details.generalDetails = {};
    
            // Update metal details
            productExists.details.metalDetails.weight = parsedWeight;
            productExists.details.metalDetails.stoneWeight = parsedStoneWeight;
            productExists.details.metalDetails.stonePrice = parsedStonePrice;
            productExists.details.metalDetails.makingCharges = parsedMakingCharges;
            productExists.details.metalDetails.subtotal = subtotal;
            productExists.details.metalDetails.gst = parsedGst;
            productExists.details.metalDetails.grandTotal = grandTotal;
    
            // Update general details
            productExists.details.generalDetails.jewelleryType = jewelleryType || productExists.details.generalDetails.jewelleryType;
            productExists.details.generalDetails.gender = gender || productExists.details.generalDetails.gender;
            productExists.details.generalDetails.collection = collection || productExists.details.generalDetails.collection;
            productExists.details.generalDetails.occasion = occasion || productExists.details.generalDetails.occasion;
    
            // Save updated product
            await productExists.save();
    
            req.flash("success", "Silver product updated successfully");
            return res.redirect(`/auth/singlesilverproduct/${productId}`);
        } catch (error) {
            console.error("Error updating silver product:", error);
            req.flash("error", "Internal server error");
            return res.redirect("/auth/allsilverproducts");
        }
    },
    



    deleteSilverProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            if (!productId) {
                req.flash("error", "Invalid product ID");
                return res.redirect("/auth/allsilverproducts");
            }
            const product = await SilverProduct.findById(productId);
            if (!product) {
                req.flash("error", "Product not found");
                return res.redirect("/auth/allsilverproducts");
            }
            if (product.image) {
                await deleteFile(product.image);
            }

            await SilverProduct.findByIdAndDelete(productId);

            req.flash("success", "Silver product deleted successfully");
            return res.redirect("/auth/allsilverproducts");
        } catch (error) {
            console.error("Error deleting silver product:", error);

            req.flash("error", "Internal server error");
            return res.redirect("/auth/allsilverproducts");
        }
    },

};
