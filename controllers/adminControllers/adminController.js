const bcrypt = require('bcrypt');
const Product = require('../../models/adminModels/product');
const HomeBanners = require('../../models/adminModels/homeBanner');
const Testimonials = require('../../models/adminModels/testimonial');
const User = require('../../models/userModels/user'); 
const silverProduct = require('../../models/adminModels/silverProduct');
const diamondProduct = require('../../models/adminModels/diamondProduct');
const contactUs = require('../../models/adminModels/contactUs');
const goldRate = require('../../models/adminModels/goldRate');
const silverRate = require('../../models/adminModels/silverRate');

// Dashboard function
exports.dashboard = async function (req, res) {
    try {
        // Check if the session contains user data
        if (!req.session.user) {
            req.flash('error', 'Please log in to access the dashboard.');
            return res.redirect('/auth/login');
        }

        const userId = req.session.user._id;
        const user = await User.findById(userId);

        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/auth/login');
        }

        // Get counts for each model
        const productCount = await Product.countDocuments();
        const bannerCount = await HomeBanners.countDocuments();
        const testimonialCount = await Testimonials.countDocuments();
        const silverProductCount = await silverProduct.countDocuments();
        const diamondProductCount = await diamondProduct.countDocuments();
        const contactUsCount = await contactUs.countDocuments();
        const userCount = await User.countDocuments();
        const goldRatesCount = await goldRate.countDocuments();
        const silverRatesCount =await silverRate.countDocuments();

        // Render the dashboard with fetched data
        res.render('dashboard', {
            productCount,
            bannerCount,
            testimonialCount,
            silverProductCount,
            userCount,
            diamondProductCount,
            contactUsCount,
            goldRatesCount,
            silverRatesCount,
            success: req.flash('success'),
            error: req.flash('error'),
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error.message, error.stack);
        req.flash('error', 'Error while fetching dashboard data!');
        res.redirect('/auth/login');
    }
};

// allUsers function
exports.allUsers = async (req, res) => {
    try {
        // Fetch all users and sort them by creation date
        const allUsers = await User.find().sort({ createdAt: -1 });

        // Render the allUsers page with the list of users
        return res.render("allUsers", {
            allUsers: allUsers,
            success: req.flash("success"),
            error: req.flash("error"),
        });
    } catch (error) {
        console.log(error);
        req.flash("error", "Internal server error");
        return res.redirect("/auth/dashboard");
    }
};

exports.singleUser = async (req, res) => {
    try {
        const userId = req.params.id;
        // console.log(userId);
        if (!userId) {
            req.flash("error", "Invalid user Id");
            return res.redirect("/auth/allusers");
        }
        const userExists = await User.findById(userId);
        if (!userExists) {
            // req.flash("error", "Invalid user details");
            return res.redirect("/auth/allusers");
        }
        return res.render("singleUser", {
            userExists: userExists,
            success: req.flash("success"),
            error: req.flash("error"),
        })
    } catch (error) {
        console.log(error);
        req.flash("error", "Internal server error");
        return res.redirect("/auth/admin/dashboard");
    }
};
exports.adminProfile = async (req, res) => {
    try {
        // Ensure that the user is logged in and the session is available
        const user = req.session.user;
        if (!user || !user._id) {
            req.flash("error", "Invalid user or session expired");
            return res.redirect("/auth/login");  // Redirect to login page if no user in session
        }

        // Proceed with fetching the user details from database
        const userExists = await User.findById(user._id);
        if (!userExists) {
            req.flash("error", "User not found");
            return res.redirect("/auth/allusers");
        }

        // Render the profile page
        return res.render("profile", {
            userExists: userExists,
            success: req.flash("success"),
            error: req.flash("error"),
        });
    } catch (error) {
        console.error("Error in adminProfile:", error);
        req.flash("error", "Internal server error");
        return res.redirect("/auth/admin/dashboard");
    }
},


  exports .updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, phoneNo } = req.body;

        // Validate userId
        if (!userId) {
            req.flash("error", "Invalid user Id");
            return res.redirect("/auth/adminprofile");
        }

        // Regex for email and phone number validation
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const phoneRegex = /^\d{10}$/;

        // Find the user by ID
        const userExists = await User.findById(userId);
        if (!userExists) {
            req.flash("error", "User not found");
            return res.redirect("/auth/adminprofile");
        }

        // Update user details if available
        userExists.name = name || userExists.name;
        
        if (email && email !== userExists.email) {
            if (!emailRegex.test(email)) {
                req.flash("error", "Invalid email format");
                return res.redirect("/auth/adminprofile");
            }
            const updateEmail = await User.findOne({ email });
            if (updateEmail) {
                req.flash("error", "Email already exists");
                return res.redirect("/auth/adminprofile");
            }
            userExists.email = email;
        }

        // Validate and update phone number
        if (phoneNo && phoneNo !== userExists.phoneNo) {
            if (!phoneRegex.test(phoneNo)) {
                req.flash("error", "Invalid phone number format. Phone number must be exactly 10 digits.");
                return res.redirect("/auth/adminprofile");
            }
            const phoneNumberExists = await User.findOne({ phoneNo });
            if (phoneNumberExists) {
                req.flash("error", "Phone number already exists");
                return res.redirect("/auth/adminprofile");
            }
            userExists.phoneNo = phoneNo;
        }

        // Save the updated user details
        await userExists.save();
        req.flash("success", "Profile updated successfully");
        return res.redirect(`/auth/adminprofile`);

    } catch (error) {
        console.log(error);
        req.flash("error", "Internal server error");
        return res.redirect("/auth/admin/dashboard");
    }
};
