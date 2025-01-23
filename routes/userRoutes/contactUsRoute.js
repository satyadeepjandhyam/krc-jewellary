const express = require('express');
const {createContactUs} = require('../../controllers/userControllers/contactUsController')
const contactUsRouter = express.Router();  




contactUsRouter.post('/create',createContactUs);

module.exports = contactUsRouter;
