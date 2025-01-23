const express = require('express');
const authRoutes = require('./authRoute')

const testRouter = express.Router();

const homeBannerRoute = require('./homeBannerRoute');
const contactUsRoute = require('./contactUsRoute');
const productRoutes = require('./productRoute');
const testimonialRoutes = require('./testimonialRoute');
const cartRoutes = require('./cartRoute');
const silverRouter = require('./silverRoute');
const diamondRouter = require('./diamondRoute')


testRouter.use('/auth', authRoutes);


testRouter.use('/banner',homeBannerRoute)
testRouter.use('/contact',contactUsRoute)
testRouter.use('/product',productRoutes)
testRouter.use('/silverProduct',silverRouter)
testRouter.use('/diamond',diamondRouter)
testRouter.use('/testimonial',testimonialRoutes)
testRouter.use('/cart',cartRoutes)

module.exports = testRouter; 