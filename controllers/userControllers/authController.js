const User = require('../../models/userModels/user');
const validation = require('../../middleWares/validations');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../middleWares/jwtUtils');
const sendMail = require('../../middleWares/sendEmail'); // Ensure to create a proper email sending function

exports.registerUser = async (req, res) => {
  const { name, email, phoneNo, password } = req.body;

  if (!name || !email || !phoneNo || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailValidation = validation.validateEmail(email);
  if (emailValidation) {
    return res.status(400).json({ message: emailValidation });
  }
  
  const phoneValidation = validation.validatePhone(phoneNo);
  if (phoneValidation) {
    return res.status(400).json({ message: phoneValidation });
  }
  
  const passwordValidation = validation.validatePassword(password);
  if (passwordValidation) {
    return res.status(400).json({ message: passwordValidation });
  }

  const nameValidation = validation.Normalnamevalidationxxxxx(name);
  if (nameValidation) {
    return res.status(400).json({ message: nameValidation });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists. Please login.' });
    }

    const phoneExist = await User.findOne({ phoneNo });
    if (phoneExist) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phoneNo,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const emailValidation = validation.validateEmail(email);
  if (emailValidation) {
    return res.status(400).json({ message: emailValidation });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.verified) {
      user.verified = true;
      await user.save();
    }

    const token = generateToken(user._id);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email, phoneNo: user.phoneNo, verified: user.verified },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;
    await user.save();

    // Send OTP to email
    await sendMail(email, 'OTP for Password Reset', `Your OTP is ${otp}`);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error in forgotPassword controller:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.validateOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.otp = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  const passwordValidation = validation.validatePassword(newPassword);
  if (passwordValidation) {
    return res.status(400).json({ message: passwordValidation });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== null) {
      return res.status(400).json({ message: 'Please validate your OTP first' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    user.otp = null; // Clear OTP after password update
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
