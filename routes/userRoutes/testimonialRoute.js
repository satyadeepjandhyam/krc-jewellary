const express = require('express');
const { createTestimonial, getAllTestimonials, deleteTestimonial } = require('../../controllers/userControllers/testimonialController');

const testimonialRouter = express.Router();  



testimonialRouter.post('/createTestimonial',createTestimonial );
testimonialRouter.get('/getAllTestimonial',getAllTestimonials)
testimonialRouter.delete('/deleteTestimonial',deleteTestimonial)

module.exports = testimonialRouter;