const express = require('express');
const diamondRouter = express.Router();
const diamondProductController = require('../../controllers/userControllers/diamondProductController');

// Get all silver products
diamondRouter.get('/diamondProducts', diamondProductController.getDiamondProducts);



// Get products by price
diamondRouter.get('/diamondProducts/metal/:metal', diamondProductController.getProductsByMetal);

// Get products by category
diamondRouter.get('diamondProducts/price', diamondProductController.getProductsByPriceRange);




module.exports = diamondRouter;
