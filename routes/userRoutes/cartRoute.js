const express = require('express');
const isAuth = require('../../middleWares/isAuth')
const { addToCart,getCart } = require('../../controllers/userControllers/cartController');

const cartRouter = express.Router();

// Add to cart
cartRouter.post('/addToCart', addToCart);
cartRouter.get('/getCart/:userId', isAuth,getCart);



module.exports = cartRouter;
