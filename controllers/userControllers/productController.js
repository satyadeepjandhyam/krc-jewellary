const products = require("../../models/adminModels/product");

const productController = {
    // Fetch all products with pagination
    getAllProducts: async (req, res) => {
        try {
            const page = parseInt(req.params.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            const allProducts = await products.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
            const totalProducts = await products.countDocuments();

            return res.status(200).json({
                success: true,
                message: "Products fetched successfully",
                data: allProducts,
                total: totalProducts,
                currentPage: page,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    getProductsByJewelleryType : async (req, res) => {
      try {
         
          let jewelleryType = req.params.jewelleryType.trim();
          console.log("Received jewelleryType from request:", jewelleryType);
  
          if (!jewelleryType) {
              return res.status(400).json({
                  success: false,
                  message: "Jewellery type is required",
              });
          }
          const productsByType = await products.find({
              "details.generalDetails.jewelleryType": { $regex: new RegExp(`^${jewelleryType}$`, 'i') }
          });
  
            if (productsByType.length === 0) {
              console.log(`No products found for jewellery type: ${jewelleryType}`);
              return res.status(404).json({
                  success: false,
                  message: "No products found for the specified jewellery type",
              });
          }
  
          return res.status(200).json({
              success: true,
              message: "Products by jewellery type fetched successfully",
              data: productsByType,
          });
      } catch (error){
          return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
      }
  },
  
 

getProductsByGender: async (req, res) => {
  try {
      const gender = req.params.gender.trim();
      const productsByGender = await products.find({
          "details.generalDetails.gender": { $regex: new RegExp(`^${gender}$`, 'i') }
      });
      if (productsByGender.length === 0) {
          console.log(`No products found for gender: ${gender}`);
          return res.status(404).json({
              success: false,
              message: "No products found for the specified gender",
          });
      }

      // Return the fetched products
      return res.status(200).json({
          success: true,
          message: "Products by gender fetched successfully",
          data: productsByGender,
      });
  } catch (error) {
      // Log the error and return a 500 response
      console.error("Error fetching products by gender:", error);
      return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
      });
  }},


  getProductsByCollection : async (req, res) => {
    try {
        // Extract and clean the collection parameter
        const collection = req.params.collection.trim();  

        // Log the received collection for debugging
        console.log("Received collection from request:", collection);

        // Use case-insensitive regex for matching the collection in the database
        const productsByCollection = await products.find({
            "details.generalDetails.collection": { $regex: new RegExp(`^${collection}$`, 'i') }
        });

        // Log the retrieved products from the database
        console.log("Products retrieved from the database:", productsByCollection);

        // Check if any products were found
        if (productsByCollection.length === 0) {
            console.log(`No products found for collection: ${collection}`);
            return res.status(404).json({
                success: false,
                message: "No products found for the specified collection",
            });
        }

        // Return the fetched products
        return res.status(200).json({
            success: true,
            message: "Products by collection fetched successfully",
            data: productsByCollection,
        });
    } catch (error) {
        // Log the error and return a 500 response
        console.error("Error fetching products by collection:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
},


searchProducts: async (req, res) => {
  try {
      // Extract the search query from request parameters
      const query = req.query;

      // Log the search query for debugging
      console.log("Search query received:", query);

      // Search for products based on name or description using case-insensitive regex
      const searchResults = await products.find({
          $or: [
              { name: { $regex: query, $options: "i" } }, // Search in name field
              { description: { $regex: query, $options: "i" } }, // Search in description field
          ],
      });

      // Check if no products are found
      if (searchResults.length === 0) {
          console.log("No products found for query:", query);
          return res.status(404).json({
              success: false,
              message: "No products found for the search query",
          });
      }

      // Return the search results
      return res.status(200).json({
          success: true,
          message: "Search results fetched successfully",
          data: searchResults,
      });
  } catch (error) {
      // Log the error for debugging
      console.error("Error searching products:", error);

      // Return a 500 error response
      return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
      });
  }
},

  // Fetch products filtered by price
getProductsByPrice: async (req, res) => {
  try {
      // Destructure the minPrice and maxPrice query parameters
      const { minPrice, maxPrice } = req.query;

      // Initialize price filter object
      const priceFilter = {};

      // Validate and set minPrice and maxPrice
      if (minPrice) {
          const min = parseFloat(minPrice);
          if (isNaN(min)) {
              return res.status(400).json({
                  success: false,
                  message: "Invalid minPrice value, must be a number",
              });
          }
          priceFilter.$gte = min;
      }

      if (maxPrice) {
          const max = parseFloat(maxPrice);
          if (isNaN(max)) {
              return res.status(400).json({
                  success: false,
                  message: "Invalid maxPrice value, must be a number",
              });
          }
          priceFilter.$lte = max;
      }

      // If neither minPrice nor maxPrice is provided, return all products
      const productsByPrice = await products.find({ price: priceFilter });

      // Return the response with filtered products
      return res.status(200).json({
          success: true,
          message: "Products by price fetched successfully",
          data: productsByPrice,
      });
  } catch (error) {
      console.error("Error fetching products by price:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
},
};

module.exports = productController;
