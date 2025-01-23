const express = require('express');
const authRouter = express.Router();
const { registerUser, loginUser, forgotPassword, validateOtp, updatePassword } = require('../../controllers/userControllers/authController');



authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/forgetPassword', forgotPassword);
authRouter.post('/validateotp', validateOtp);
authRouter.post('/updatePassword', updatePassword);

module.exports = authRouter;
