const express = require('express');

const { createBanner, getAllBanners, deleteBanner } = require('../../controllers/userControllers/homeBannerController');
const homeBannerRouter = express.Router();  



homeBannerRouter.post('/createHomeBanner',createBanner );
homeBannerRouter.get('/getAllBanners',getAllBanners)
homeBannerRouter.delete('/deleteBanner',deleteBanner)

module.exports = homeBannerRouter;