const express = require('express');
const silverRouter = express.Router();
const silverProductController = require('../../controllers/userControllers/silverProductController');

// Get all silver products
silverRouter.get('/getAllSilverProducts', silverProductController.getAllSilverProducts);



// Get products by price
silverRouter.get('/getProductsByPrice', silverProductController.getProductsByPrice);

// Get products by category
silverRouter.get('/getProductsByCollections/:collection', silverProductController.getProductsByCollections);

silverRouter.get('/getProductsByGender/:gender', silverProductController.getProductsByGender);


// Search products
silverRouter.get('/searchProducts', silverProductController.searchProducts);

// Get products by jewellery type
silverRouter.get('/getProductsByJewelleryType/:jewelleryType', silverProductController.getProductsByJewelleryType);

module.exports = silverRouter;
