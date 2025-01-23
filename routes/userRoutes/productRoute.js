const express = require("express");
const productRouter = express.Router();
const productController = require("../../controllers/userControllers/productController");

// Route to get all products with optional pagination
productRouter.get("/getAllProducts/:page?", productController.getAllProducts);

// Route to get products by jewellery type
productRouter.get("/getProductsByJewelleryType/:jewelleryType", productController.getProductsByJewelleryType);



// Route to get products by gender
productRouter.get("/getProductsByGender/:gender", productController.getProductsByGender);

// Route to get products by collection
productRouter.get("/getProductsByCollection/:collection", productController.getProductsByCollection);

// Route to search products by query
productRouter.get("/search", productController.searchProducts);

// Route to get products filtered by price range
productRouter.get("/getProductByPrice", productController.getProductsByPrice);

module.exports = productRouter;
