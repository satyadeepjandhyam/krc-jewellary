const express = require('express');
const isAuth = require('../../middleWares/isAuth')
const adminAuthController = require('../../controllers/adminControllers/adminAuthController');
const adminController = require('../../controllers/adminControllers/adminController');
const productsController = require('../../controllers/adminControllers/productsController');
const homeBannerController = require('../../controllers/adminControllers/homeBannerController');
const contactUsController = require('../../controllers/adminControllers/contactUsController');
const testimonialController = require('../../controllers/adminControllers/testimonialController')
const goldRateController = require('../../controllers/adminControllers/goldRateController') 
const silverRateController = require('../../controllers/adminControllers/silverRateController')
const silverProductController = require('../../controllers/adminControllers/silverProductController')
const diamondController = require('../../controllers/adminControllers/diamondController');
const adminAuthRouter = express.Router();  

// Public routes
adminAuthRouter.get('/login', adminAuthController.index);
adminAuthRouter.post('/loginpost', adminAuthController.login); 
adminAuthRouter.get('/forgot-password', adminAuthController.forgotPasswordPage);
adminAuthRouter.post('/forgot-password', adminAuthController.sendOTP);

adminAuthRouter.get('/verify-otp', adminAuthController.verifyOTPPage);
adminAuthRouter.post('/verify-otp', adminAuthController.verifyOTP);

adminAuthRouter.get('/reset-password', adminAuthController.resetPasswordPage);
adminAuthRouter.post('/reset-password', adminAuthController.resetPassword);

adminAuthRouter.get("/user/:id", isAuth,adminController.singleUser);
adminAuthRouter.get("/allusers",isAuth, adminController.allUsers);
adminAuthRouter.get("/adminprofile", isAuth,adminController.adminProfile);
adminAuthRouter.post("/updateprofile/:id",isAuth,adminController.updateProfile);


adminAuthRouter.get("/allproducts",isAuth, productsController.allProducts);
adminAuthRouter.post("/createproduct",isAuth, productsController.addProduct);
adminAuthRouter.get('/addProduct',isAuth, productsController.addProductPage);
adminAuthRouter.get("/product/:id",isAuth,productsController.singleProduct);
adminAuthRouter.post("/updateproduct/:id",isAuth,productsController.updateProduct)
adminAuthRouter.post("/deleteproduct/:id",isAuth,productsController.deleteProduct);
adminAuthRouter.get("/singleproduct/:id",isAuth,productsController.singleProduct)


adminAuthRouter.get("/allsilverproducts", isAuth, silverProductController.allSilverProducts);
adminAuthRouter.get("/singlesilverproduct/:id", isAuth, silverProductController.singleSilverProduct);
adminAuthRouter.get("/addSilverProduct", isAuth, silverProductController.addSilverProductPage);
adminAuthRouter.post("/addSilverProduct", isAuth, silverProductController.addSilverProduct);
adminAuthRouter.post("/updateSilverProduct/:id",  isAuth, silverProductController.updateSilverProduct);
adminAuthRouter.post("/deleteSilverProduct/:id",  isAuth, silverProductController.deleteSilverProduct);


adminAuthRouter.get("/alldiamondproducts", isAuth, diamondController.allProducts);
adminAuthRouter.get('/addDiamondProduct', isAuth, diamondController.addProductPage);
adminAuthRouter.post("/creatediamondproduct", isAuth, diamondController.addProduct);
adminAuthRouter.get("/singlediamondproduct/:id", isAuth, diamondController.singleProduct);
adminAuthRouter.post("/updatediamondproduct/:id", isAuth, diamondController.updateProduct);
adminAuthRouter.post("/deletediamondproduct/:id", isAuth, diamondController.deleteProduct);
adminAuthRouter.get("/singlediamondproduct/:id", isAuth, diamondController.singleProduct);





adminAuthRouter.post("/addbanner",isAuth,homeBannerController.addBanner);
adminAuthRouter.get("/allbanners",isAuth,homeBannerController.allBanners);
adminAuthRouter.get("/banner/:id",isAuth,homeBannerController.singleBanner);
adminAuthRouter.post("/updatebanner",isAuth,homeBannerController.updateBanner);
adminAuthRouter.post("/deletebanner/:id",isAuth,homeBannerController.deleteBanner);


adminAuthRouter.get("/getAllContactUs",isAuth,contactUsController.getMessages);
adminAuthRouter.get("/getContactUs/:id",isAuth,contactUsController.getMessageById);


adminAuthRouter.get('/allTestimonial', isAuth,testimonialController.getAllTestimonials);
adminAuthRouter.get('/getTestimonial/:id',isAuth, testimonialController.getTestimonialById);
adminAuthRouter.post('/createTestimonial',isAuth, testimonialController.createTestimonial);
adminAuthRouter.post('/updateTestimonial/:id',isAuth, testimonialController.updateTestimonial);
adminAuthRouter.post('/deleteTestimonial/:id',isAuth, testimonialController.deleteTestimonial);

adminAuthRouter.get('/goldRates',isAuth, goldRateController.getGoldRatesHistory);
adminAuthRouter.post('/goldRates',isAuth, goldRateController.addGoldRate);
adminAuthRouter.post('/updateGoldRate/:id',isAuth, goldRateController.updateGoldRate);
adminAuthRouter.post('/deleteGoldRate/:id',isAuth, goldRateController.deleteGoldRate);


adminAuthRouter.get('/silverRates', isAuth,silverRateController.getSilverRates);
adminAuthRouter.post('/silverRates/add',isAuth, silverRateController.addSilverRate);
// adminAuthRouter.post('/silverRates/update/:id',isAuth, silverRateController.updateSilverRate);
adminAuthRouter.post('/silverRates/delete/:id', isAuth, silverRateController.deleteSilverRate);


adminAuthRouter.get('/logout',isAuth, adminAuthController.logout);


adminAuthRouter.get('/admin/dashboard', isAuth, adminController.dashboard);


module.exports = adminAuthRouter;
