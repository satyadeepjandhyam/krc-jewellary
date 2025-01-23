const SilverProduct = require('../../models/adminModels/silverProduct');
const DiamondProduct = require('../../models/adminModels/diamondProduct');
const Cart = require('../../models/userModels/cart');

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find the product, it could be either SilverProduct or DiamondProduct
    let product;
    let subtotal = 0;

    // First, check if it's a SilverProduct
    product = await SilverProduct.findById(productId);
    if (product) {
      console.log("Found SilverProduct:", product);
      subtotal = product.details.metalDetails.grandTotal * quantity;
    } else {
      // If SilverProduct is not found, check for DiamondProduct
      product = await DiamondProduct.findById(productId);
      if (product) {
        console.log("Found DiamondProduct:", product);
        subtotal = product.price * quantity;
      } else {
        // If neither SilverProduct nor DiamondProduct is found, check for general Product
        product = await product.findById(productId);
        if (product) {
          console.log("Found General Product:", product);
          if (product.details.metalDetails && product.details.metalDetails.grandTotal) {
            // For products with metalDetails, use grandTotal
            subtotal = product.details.metalDetails.grandTotal * quantity;
          } else {
            // Otherwise, use the price field (assuming it's a general product)
            subtotal = product.price * quantity;
          }
        }
      }
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (isNaN(subtotal) || subtotal <= 0) {
      return res.status(400).json({ message: 'Invalid product price or quantity' });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingItemIndex >= 0) {
      // If product exists, update quantity and subtotal
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].subtotal += subtotal;
    } else {
      // If product doesn't exist, add it to the cart
      cart.items.push({
        productId,
        quantity,
        subtotal,
      });
    }

    // Update the total price of the cart
    cart.totalPrice = cart.items.reduce((total, item) => total + item.subtotal, 0);

    // Ensure totalPrice is a valid number
    if (isNaN(cart.totalPrice) || cart.totalPrice <= 0) {
      return res.status(400).json({ message: 'Invalid total price' });
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user's cart and populate product details
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Format the cart response to include product details
    const cartDetails = cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      subtotal: item.subtotal,
      price: item.productId.price || item.productId.details?.metalDetails?.grandTotal, // Price for different types of products
    }));

    // Return the cart details along with the total price
    res.status(200).json({
      cart: {
        items: cartDetails,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
