const HomeBanner = require("../../models/adminModels/homeBanner");
const {handleFileUpload} = require("../../middleWares/jwtUtils"); 

module.exports = {
    // addBanner: async (req, res) => {
        
       
    //     // console.log("iu hgihdghkdfhgihdgh");
    //     try {
    //         // Access uploaded file
    //         const bannerImage = req.files ? req.files.image:null // 'image' matches the name attribute in the form
    //         if (!bannerImage) {
    //             req.flash("error", "No image uploaded");
    //             return res.redirect("/auth/allbanners");
    //         }
    //         // console.log("hfb gegfgufgug",bannerImage);
    //         // Handle file upload (implement handleFileUpload)
    //         const bannerImagePath = await handleFileUpload(bannerImage, "homeBanners");
    //         console.log("path: ",bannerImagePath);
    //         // Save banner to database
    //         const newBanner = await HomeBanner.create({
    //             bannerImage: bannerImagePath,
    //         });

    //         if (!newBanner) {
    //             req.flash("error", "Error while creating a new banner");
    //             return res.redirect("/auth/allbanners");
    //         }

    //         req.flash("success", "Banner added successfully");
    //         return res.redirect("/auth/allbanners");
    //     } catch (error) {
    //         console.log(error);
    //         req.flash("error", "Internal server error");
    //         return res.redirect("/api/admin/dashboard");
    //     }
    // },


    // Read (Get All Banners)


    addBanner: async (req, res) => {
        try {
            // Access uploaded file from multipart data
            const bannerImage = req.files ? req.files.image : null; // 'image' matches the name attribute in the form
    
            if (!bannerImage) {
                req.flash("error", "No image uploaded");
                return res.redirect("/auth/allbanners");
            }
    
            // bannerImage.data contains the binary content of the uploaded file
            const bannerImageBuffer = bannerImage.data; // Accessing buffer from the uploaded file
    
            // Save banner to database
            const newBanner = await HomeBanner.create({
                bannerImage: bannerImageBuffer, // Storing the image as a Buffer
            });
    
            if (!newBanner) {
                req.flash("error", "Error while creating a new banner");
                return res.redirect("/auth/allbanners");
            }
    
            req.flash("success", "Banner added successfully");
            return res.redirect("/auth/allbanners");
        } catch (error) {
            console.error("Error:", error);
            req.flash("error", "Internal server error");
            return res.redirect("/api/admin/dashboard");
        }
    },

    allBanners: async (req, res) => {
        try {
            // Fetch all banners from the database, sorted by the creation date
            const banners = await HomeBanner.find().sort({ createdAt: -1 });
    
            // Convert each banner's image buffer to a Base64 string
            const bannersWithBase64 = banners.map(banner => ({
                ...banner._doc,
                bannerImageBase64: banner.bannerImage.toString('base64'), // Convert buffer to Base64
            }));
    
            // Render the 'allBanners' template and pass the banners with Base64 image data
            return res.render("allBanners", {
                banners: bannersWithBase64,
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.log(error);
            req.flash("error", "Internal server error");
            return res.redirect("/api/admin/dashboard");
        }
    },
    
    
    // allBanners: async (req, res) => {
    //     try {
    //         const banners = await HomeBanner.find().sort({ createdAt: -1 });
    //         return res.render("allBanners", {
    //             banners: banners,
    //             success: req.flash("success"),
    //             error: req.flash("error"),
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         req.flash("error", "Internal server error");
    //         return res.redirect("/api/admin/dashboard");
    //     }
    // },

    // Read (Get Single Banner by ID)
    singleBanner: async (req, res) => {
        try {
            const bannerId = req.params.id;
            if (!bannerId) {
                req.flash("error", "Invalid banner ID");
                return res.redirect("/auth/allbanners");
            }
            const banner = await HomeBanner.findById(bannerId);
            if (!banner) {
                req.flash("error", "Banner not found");
                return res.redirect("/auth/allbanners");
            }
            return res.render("singleBanner", {
                banner: banner,
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } catch (error) {
            console.log(error);
            req.flash("error", "Internal server error");
            return res.redirect("/api/admin/dashboard");
        }
    },

    // Update Banner (Update)
    updateBanner: async (req, res) => {
        try {
            const bannerId = req.params.id;
            if (!bannerId) {
                req.flash("error", "Invalid banner ID");
                return res.redirect("/auth/allbanners");
            }

            const bannerImage = req.files ? req.files.bannerImage : null;
            let bannerImagePath = null;

            // If a new image is uploaded, process it; otherwise, keep the existing one
            if (bannerImage) {
                bannerImagePath = await handleFileUpload(bannerImage, "homeBanners");
            } else {
                const banner = await HomeBanner.findById(bannerId);
                bannerImagePath = banner.image; // Keep the existing image if no new image is uploaded
            }

            const updatedBanner = await HomeBanner.findByIdAndUpdate(
                bannerId,
                { image: bannerImagePath },  // Update the banner image
                { new: true }
            );

            if (!updatedBanner) {
                req.flash("error", "Error updating the banner");
                return res.redirect("/auth/allbanners");
            }

            req.flash("success", "Banner updated successfully");
            return res.redirect("/auth/allbanners");
        } catch (error) {
            console.log(error);
            req.flash("error", "Internal server error");
            return res.redirect("/auth/allbanners");
        }
    },

    // Delete Banner (Delete)
    deleteBanner: async (req, res) => {
        try {
            const bannerId = req.params.id;
            if (!bannerId) {
                req.flash("error", "Invalid banner ID");
                return res.redirect("/auth/allbanners");
            }

            const deletedBanner = await HomeBanner.findByIdAndDelete(bannerId);

            if (!deletedBanner) {
                req.flash("error", "Error deleting the banner");
                return res.redirect("/auth/allbanners");
            }

            req.flash("success", "Banner deleted successfully");
            return res.redirect("/auth/allbanners");
        } catch (error) {
            console.log(error);
            req.flash("error", "Internal server error");
            return res.redirect("/auth/allbanners");
        }
    },
};
