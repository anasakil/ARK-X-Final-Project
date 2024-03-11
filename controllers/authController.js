const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');



const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'email already exists' });
    }

    const user = await User.create({ username, email, password, role });
    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: 'User created successfully', token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message,
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Email could not be sent' });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Assuming req.user._id is set by your authentication middleware
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
     // Hash the new password before saving
     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(newPassword, salt);



    await user.save();

    // You might want to remove sensitive information or use a DTO before sending the response
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error); // Logging the error to the console for debugging
    res.status(500).json({ message: error.message });
  }
};



exports.logout= async(req,res)=>{
  try{
    res.cookie('token','none',{
      expires: new Date(0),
      httpOnly:true
    })
    res.status(200).json({ message: 'Logged out successfully' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: err.message });
  }
  }



