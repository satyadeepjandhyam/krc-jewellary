const bcrypt = require('bcryptjs');
const User = require('../../models/userModels/user');
const { sendMail } = require('../../middleWares/sendEmail');

module.exports = {
    index: async (req, res) => {
        try {
            return res.render('login', {
                success: req.flash('success'),
                error: req.flash('error'),
            });
        } catch (error) {
            req.flash('error', 'Internal server error');
            return res.redirect('/auth/login');
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
    
            // Check if email and password are provided
            if (!email || !password) {
                req.flash('error', 'Invalid fields');
                return res.redirect('/auth/login');
            }
    
            // Check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                req.flash('error', 'No user found with this email');
                return res.redirect('/auth/login');
            }
    
            // Check if the user is an admin
            if (!user.isAdmin) {
                req.flash('error', 'You don’t have admin access');
                return res.redirect('/auth/login');
            }
    
            // Compare password with the stored hash
            const matchedPassword = await bcrypt.compare(password, user.password);
            if (!matchedPassword) {
                req.flash('error', 'Incorrect password');
                return res.redirect('/auth/login');
            }
    
            // Store user data in session if authenticated
            req.session.user = user; // Store admin data in session
            req.session.save((err) => {
                if (err) {
                    console.error(err);
                    req.flash('error', 'Failed to save session');
                    return res.redirect('/auth/login');
                }
                return res.redirect('/auth/admin/dashboard'); // Redirect to admin dashboard
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Internal server error');
            return res.redirect('/auth/login');
        }
    },
    
    forgotPasswordPage: (req, res) => {
            return res.render('forgot-password', {
                success: req.flash('success'),
                error: req.flash('error'),
            });
        },
        sendOTP: async (req, res) => {
            try {
                const { email } = req.body;
    
                if (!email) {
                    req.flash('error', 'Email is required');
                    return res.redirect('/auth/forgot-password');
                }
    
                const user = await User.findOne({ email });
                if (!user) {
                    req.flash('error', 'No account found with this email');
                    return res.redirect('/auth/forgot-password');
                }
    
                // Generate OTP
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes validity
    
                // Store OTP and expiry in the user's record
                user.otp = otp;
                user.otpExpiry = otpExpiry;
                await user.save();
    
                // Use sendMail function to send OTP via email
                await sendMail(
                    email,
                    'Password Reset OTP',
                    `Your OTP is ${otp}. It is valid for 15 minutes.`
                );
               
                req.flash('success', 'OTP sent to your email');
                return res.redirect('/auth/verify-otp');
            } catch (error) {
                console.error(error);
                req.flash('error', 'Failed to send OTP');
                return res.redirect('/auth/forgot-password');
            }
        },

        verifyOTPPage: (req, res) => {
            return res.render('verify-otp', {
                success: req.flash('success'),
                error: req.flash('error'),
            });
        },
        verifyOTP: async (req, res) => {
            try {
                const { email, otp } = req.body;
        
                if (!email || !otp) {
                    req.flash('error', 'All fields are required');
                    return res.redirect('/auth/verify-otp');
                }
        
                const user = await User.findOne({ email });
                if (!user) {
                    req.flash('error', 'No account found with this email');
                    return res.redirect('/auth/verify-otp');
                }
        
                // Log OTP verification attempt
                console.log(`Verifying OTP for ${email}: User OTP: ${user.otp}, Provided OTP: ${otp}`);
        
                if (user.otp !== otp || Date.now() > user.otpExpiry) {
                    req.flash('error', 'Invalid or expired OTP');
                    return res.redirect('/auth/verify-otp');
                }
        
                req.flash('success', 'OTP verified. You can now reset your password');
                req.session.email = email; // Store email in session for resetting password
                return res.redirect('/auth/reset-password');
            } catch (error) {
                console.error(error);
                req.flash('error', 'Failed to verify OTP');
                return res.redirect('/auth/verify-otp');
            }
        },
        resetPasswordPage: (req, res) => {
            return res.render('reset-password', {
                success: req.flash('success'),
                error: req.flash('error'),
            });
        },
        resetPassword: async (req, res) => {
            try {
                const { password, confirmPassword } = req.body;
                const email = req.session.email;
    
                if (!email || !password || !confirmPassword) {
                    req.flash('error', 'All fields are required');
                    return res.redirect('/auth/reset-password');
                }
    
                if (password !== confirmPassword) {
                    req.flash('error', 'Passwords do not match');
                    return res.redirect('/auth/reset-password');
                }
    
                const user = await User.findOne({ email });
                if (!user) {
                    req.flash('error', 'No account found');
                    return res.redirect('/auth/reset-password');
                }
    
                // Hash and update the password
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
                user.otp = null; // Clear OTP
                user.otpExpiry = null;
                await user.save();
    
                req.flash('success', 'Password reset successful');
                req.session.destroy();
                return res.redirect('/auth/login');
            } catch (error) {
                console.error(error);
                req.flash('error', 'Failed to reset password');
                return res.redirect('/auth/reset-password');
            }
        },
    
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                req.flash('error', 'Failed to log out');
                return res.redirect('/auth/admin/dashboard');
            }
            return res.redirect('/auth/login');
        });
    },
};
