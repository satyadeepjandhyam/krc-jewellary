const { handleFileUpload ,deleteFile} = require('../../middleWares/jwtUtils');
const DiamondProduct = require('../../models/adminModels/diamondProduct');

// Fetch and render all products
exports.allProducts = async (req, res) => {
  try {
    const products = await DiamondProduct.find();
    res.render('allDiamondProducts', { products });
  } catch (error) {
    req.flash('error', 'Error fetching diamond products');
    res.redirect('/auth/alldiamondproducts');
  }
};

// Render the add product page
exports.addProductPage = (req, res) => {
  res.render('addDiamondProduct');
};

// Handle the logic for adding a new product
exports.addProduct = async (req, res) => {
    try {
      const { name, price, diamondQuality, carat, cut, color, clarity, description , metal } = req.body;
  
      // Handle the file upload
      const image = req.files ? req.files.image : null; // 'image' matches the name attribute in the form
      if (!image) {
        req.flash('error', 'No image uploaded');
        return res.redirect('/auth/addDiamondProduct');
      }
  
      const imagePath = await handleFileUpload(image, 'diamondProducts'); // Handle file upload and store the image
      console.log('Image uploaded at:', imagePath);  // Log image path for debugging
  
      const newProduct = new DiamondProduct({
        name,
        price,
        image: imagePath, // Store the image path in the database
        diamondQuality,
        carat,
        cut,
        color,
        clarity,
        description,
        metal,
      });
  
      console.log('Creating new product:', newProduct);  // Log the product object before saving
  
      await newProduct.save();
      req.flash('success', 'Diamond product added successfully');
      res.redirect('/auth/alldiamondproducts');
    } catch (error) {
      console.error('Error adding diamond product:', error);  // Log the error
      req.flash('error', 'Error adding diamond product');
      res.redirect('/auth/addDiamondProduct');
    }
  };
  
// View a single product's details
exports.singleProduct = async (req, res) => {
  try {
    const product = await DiamondProduct.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Diamond product not found');
      return res.redirect('/auth/alldiamondproducts');
    }
    res.render('singleDiamondProduct', { product });
  } catch (error) {
    req.flash('error', 'Error fetching diamond product');
    res.redirect('/auth/alldiamondproducts');
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, diamondQuality, carat, cut, color, clarity, description ,metal} = req.body;

    let imagePath = null;
    const image = req.files ? req.files.image : null;

    // Retrieve the existing product
    const product = await DiamondProduct.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Diamond product not found');
      return res.redirect('/auth/alldiamondproducts');
    }

    // Process the new image if uploaded
    if (image) {
      // Delete the existing image
      if (product.image) {
        await deleteFile(product.image); // Ensure the correct relative path is passed
      }

      // Upload the new image
      imagePath = await handleFileUpload(image, 'diamondProducts');
    } else {
      // Keep the existing image if no new image is uploaded
      imagePath = product.image;
    }

    // Update the product details
    const updatedProduct = await DiamondProduct.findByIdAndUpdate(
      req.params.id,
      { name, price, image: imagePath, diamondQuality, carat, cut, color, clarity, description ,metal },
      { new: true }
    );

    if (!updatedProduct) {
      req.flash('error', 'Error updating diamond product');
      return res.redirect('/auth/alldiamondproducts');
    }

    req.flash('success', 'Diamond product updated successfully');
    res.redirect('/auth/alldiamondproducts');
  } catch (error) {
    console.error('Error updating diamond product:', error);
    req.flash('error', 'Error updating diamond product');
    res.redirect('/auth/alldiamondproducts');
  }
};


// Delete a product from the database
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
        req.flash('error', 'Diamond product Id');
        return res.redirect('/auth/alldiamondproducts');
      }

    const product = await DiamondProduct.findById(productId);
    if (!product) {
      req.flash('error', 'Diamond product not found');
      return res.redirect('/auth/alldiamondproducts');
    }
    if (product.image) {
        await deleteFile(product.image);
    }
    await DiamondProduct.findByIdAndDelete(productId);
    req.flash('success', 'Diamond product deleted successfully');
    res.redirect('/auth/alldiamondproducts');
  } catch (error) {
    req.flash('error', 'Error deleting diamond product');
    res.redirect('/auth/alldiamondproducts');
  }
};
