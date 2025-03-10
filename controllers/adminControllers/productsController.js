const products = require("../../models/adminModels/product.js");
const GoldRate = require("../../models/adminModels/goldRate.js");
const { handleFileUpload, deleteFile } = require("../../middleWares/jwtUtils.js");

module.exports = {
    allProducts: async (req, res) => {
        try {
            const productExists = await products.find().sort({ createdAt: -1 });
            return res.render("allProducts", {
                productExists: productExists,
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.log(error);
            req.flash("error", "Internal server error");
            return res.redirect("/auth/admin/dashboard");
        }
    },

    singleProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            if (!productId) {
                req.flash("error", "Invalid product Id");
                return res.redirect("/auth/allproducts");
            }
            const productExists = await products.findById(productId);
            if (!productExists) {
                req.flash("error", "Invalid product details");
                return res.redirect("/auth/allproducts");
            }
            return res.render("singleProduct", {
                productExists: productExists,
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.log(error);
            req.flash("error", "Internal server error");
            return res.redirect("/api/admin/dashboard");
        }
    },

    addProductPage: (req, res) => {
        try {

            return res.render("addProduct", {
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.error("Error rendering add product page:", error);
            req.flash("error", "Internal server error");
            return res.redirect("/auth/allproducts");
        }
    },

    updateProduct: async (req, res) => {
        try {
            const productId = req.params.id;
    
            if (!productId) {
                req.flash("error", "Invalid product ID");
                return res.redirect("/auth/allproducts");
            }
    
            const productExists = await products.findById(productId);
            if (!productExists) {
                req.flash("error", "Product not found");
                return res.redirect("/auth/allproducts");
            }
    
            const {
                name,
                category,
                price,
                description,
                'details.metalDetails.karats': karats,
                'details.metalDetails.weight': weight,
                'details.metalDetails.metal': metal,
                'details.metalDetails.goldWeight': goldWeight,
                'details.metalDetails.stoneWeight': stoneWeight,
                'details.metalDetails.makingCharges': makingCharges,
                'details.metalDetails.stonePrice': stonePrice,
                // 'details.metalDetails.subtotal': subtotal,
                'details.metalDetails.gst': gst,
                // 'details.metalDetails.grandTotal': grandTotal,
                'details.generalDetails.jewelleryType': jewelleryType,
                'details.generalDetails.gender': gender,
                'details.generalDetails.collection': collection,
                'details.generalDetails.occasion': occasion,
            } = req.body;
    
            const productImage = req.files ? req.files.productImage : null;
            if (productImage) {
                if (productExists.image) {
                    console.log("----------->existingone", productExists.image);
                    await deleteFile(productExists.image);
                }
                const imagePath = await handleFileUpload(productImage, "productPictures");
                console.log("---------->newone");
                productExists.image = imagePath;
            }
    
            productExists.name = name || productExists.name;
            productExists.category = category || productExists.category;
            productExists.price = price || productExists.price;
            productExists.description = description || productExists.description;
    
            if (!productExists.details) productExists.details = {};
            if (!productExists.details.metalDetails) productExists.details.metalDetails = {};
    
            // Recalculate the values based on updated fields
            const parsedWeight = parseFloat(weight);
            const parsedStoneWeight = parseFloat(stoneWeight);
            const parsedStonePrice = parseFloat(stonePrice) || 0;
            const parsedMakingCharges = parseFloat(makingCharges) || 0;
        
          
            let karatRate;
    
            // Calculate the karat rate based on gold type
            const goldRate = await GoldRate.findOne().sort({ date: -1 });
            if (!goldRate) {
                req.flash("error", "Unable to fetch gold rates");
                return res.redirect("/auth/allproducts");
            }
    
            // Calculate the karat rate
            if (karats === "22k") {
                karatRate = goldRate.rate22Carat * parsedWeight;
            } else if (karats === "24k") {
                karatRate = goldRate.rate24Carat * parsedWeight;
            } else if (karats === "18k") {
                karatRate = goldRate.rate18Carat * parsedWeight;
            } else {
                req.flash("error", "Invalid gold type");
                return res.redirect("/auth/allproducts");
            }
    
            // Calculate the stone price based on karats and stone weight
            let calculatedStonePrice;
            if (karats === "22k") {
                calculatedStonePrice = parsedStoneWeight * goldRate.rate22Carat;
            } else if (karats === "24k") {
                calculatedStonePrice = parsedStoneWeight * goldRate.rate24Carat;
            } else if (karats === "18k") {
                calculatedStonePrice = parsedStoneWeight * goldRate.rate18Carat;
            } else {
                calculatedStonePrice = 0; 
            }
    
            console.log("Calculated Stone Price:", calculatedStonePrice);
    
            // Calculate subtotal (price = karat rate - stone price + stone price + making charges)
            let subtotal = karatRate - calculatedStonePrice + parsedStonePrice + parsedMakingCharges;
            console.log("Subtotal:", subtotal);
    
            let  grandTotal = subtotal + parsedGst;
            console.log("Grand Total:", grandTotal);
    
            // Update product details with the recalculated values
            productExists.name = name || productExists.name;
            productExists.category = category || productExists.category;
            productExists.price = price || productExists.price;
            productExists.description = description || productExists.description;
            productExists.details.metalDetails.karats = karats || productExists.details.metalDetails.karats;
            productExists.details.metalDetails.weight = weight || productExists.details.metalDetails.weight;
            productExists.details.metalDetails.metal = metal || productExists.details.metalDetails.metal;
            productExists.details.metalDetails.goldWeight = goldWeight || productExists.details.metalDetails.goldWeight;
            productExists.details.metalDetails.stoneWeight = stoneWeight || productExists.details.metalDetails.stoneWeight;
            productExists.details.metalDetails.stonePrice = stonePrice || productExists.details.metalDetails.stonePrice;
            productExists.details.metalDetails.makingCharges = makingCharges || productExists.details.metalDetails.makingCharges;
            productExists.details.metalDetails.subtotal = subtotal || productExists.details.metalDetails.subtotal;
            productExists.details.metalDetails.gst = gst || productExists.details.metalDetails.gst;
            productExists.details.metalDetails.grandTotal = grandTotal || productExists.details.metalDetails.grandTotal;
    
            if (!productExists.details.generalDetails) productExists.details.generalDetails = {};
            productExists.details.generalDetails.jewelleryType = jewelleryType || productExists.details.generalDetails.jewelleryType;
            productExists.details.generalDetails.gender = gender || productExists.details.generalDetails.gender;
            productExists.details.generalDetails.collection = collection || productExists.details.generalDetails.collection;
            productExists.details.generalDetails.occasion = occasion || productExists.details.generalDetails.occasion;
    
            await productExists.save();
    
            req.flash("success", "Product updated successfully");
            return res.redirect(`/auth/singleproduct/${productId}`);
        } catch (error) {
            console.error("Error updating product:", error);
            req.flash("error", "Internal server error");
            return res.redirect("/auth/allproducts");
        }
    },
    

    addProduct: async (req, res) => {
        try {
            const {
                name,
                category,
                description,
                'details.metalDetails.karats': karats,
                'details.metalDetails.weight': weight,
                'details.metalDetails.metal': metal,
                'details.metalDetails.goldWeight': goldWeight,
                'details.metalDetails.stoneWeight': stoneWeight,
                'details.metalDetails.stonePrice': stonePrice,
                'details.metalDetails.makingCharges': makingCharges,
                // 'details.metalDetails.gst': gst,
                'details.generalDetails.jewelleryType': jewelleryType,
                'details.generalDetails.gender': gender,
                'details.generalDetails.collection': collection,
                'details.generalDetails.occasion': occasion,
            } = req.body;

            console.log("kgygyug",req.body)
            const goldRate = await GoldRate.findOne().sort({ date: -1 });
            if (!goldRate) {
                req.flash("error", "Unable to fetch gold rates");
                return res.redirect("/auth/allproducts");
            }

            const parsedWeight = parseFloat(weight);
            if (isNaN(parsedWeight)) {
                req.flash("error", "Invalid weight");
                return res.redirect("/auth/addProduct");
            }

            let calculatedPrice;
            let karatRate;

        
            if (karats === "22k") {
                karatRate = goldRate.rate22Carat * parsedWeight;
            } else if (karats === "24k") {
                karatRate = goldRate.rate24Carat * parsedWeight;
            } else if (karats === "18k") {
                karatRate = goldRate.rate18Carat * parsedWeight;
            } else {
                req.flash("error", "Invalid gold type");
                return res.redirect("/auth/addProduct");
            }

            calculatedPrice = karatRate;
            console.log("Karat Type:", karats);
            console.log("Parsed Weight:", parsedWeight);
            console.log("Karat Rate:", karatRate);
            console.log("Calculated Price:", calculatedPrice);

            // Validate the calculated price
            if (isNaN(calculatedPrice)) {
                req.flash("error", "Calculated price is invalid");
                return res.redirect("/auth/addProduct");
            }

            // Parse and calculate stone weight dynamically
            const parsedStoneWeight = parseFloat(stoneWeight)||0;
            console.log("Parsed Stone Weight:", parsedStoneWeight);

            let calculatedStonePrice;
            if (karats === "22k") {
                calculatedStonePrice = parsedStoneWeight * goldRate.rate22Carat;
            } else if (karats === "24k") {
                calculatedStonePrice = parsedStoneWeight * goldRate.rate24Carat;
            } else if (karats === "18k") {
                calculatedStonePrice = parsedStoneWeight * goldRate.rate18Carat;
            } else {
                calculatedStonePrice = 0; // Default to 0 if karats are invalid
            }
            console.log("Calculated Stone Price:", calculatedStonePrice);

        
            const parsedStonePrice = parseFloat(stonePrice) || 0;
            const parsedMakingCharges = parseFloat(makingCharges) || 0;

            console.log("Parsed Stone Price:", parsedStonePrice);
            console.log("Parsed Making Charges:", parsedMakingCharges);

         
            const subtotal = calculatedPrice - calculatedStonePrice + parsedStonePrice + parsedMakingCharges;
            console.log("Subtotal:", subtotal);

            const gstAmount = subtotal * 0.18; 
            console.log("GST (13%):", gstAmount);

            const grandTotal = subtotal + gstAmount;
            console.log("Grand Total:", grandTotal);

            const image = req.files ? req.files.productImage : null;
            if (!image) {
                req.flash("error", "Invalid picture");
                return res.redirect("/auth/allproducts");
            }
            const imagePath = await handleFileUpload(image, "productPictures");

            const newProduct = await products.create({
                image: imagePath,
                name,
                category,
                price: calculatedPrice,
                description,
                details: {
                    metalDetails: {
                        karats,
                        weight,
                        metal,
                        goldWeight,
                        stoneWeight,
                        stonePrice,
                        makingCharges,
                        subtotal,
                        gst: gstAmount,
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

            if (!newProduct) {
                req.flash("error", "Error while adding the product");
                return res.redirect("/auth/addProduct");
            }

            req.flash("success", "Product added successfully");
            return res.redirect("/auth/allproducts");
        } catch (error) {
            console.error("Error while adding product:", error);
            req.flash("error", "Internal server error");
            return res.redirect("/api/admin/dashboard");
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            if (!productId) {
                req.flash("error", "Invalid product ID");
                return res.redirect("/auth/allproducts");
            }
            const productExists = await products.findById(productId);
            if (!productExists) {
                req.flash("error", "Invalid product details");
                return res.redirect("/auth/allproducts");
            }
            await deleteFile(productExists.image);
            await products.findByIdAndDelete(productId);
            req.flash("success", "Product deleted successfully");
            return res.redirect("/auth/allproducts");
        } catch (error) {
            console.error("Error deleting product:", error);
            req.flash("error", "Internal server error");
            return res.redirect("/auth/allproducts");
        }
    },

};
