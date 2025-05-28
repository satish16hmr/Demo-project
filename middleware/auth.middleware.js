const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

module.exports.authentication = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers['authorization']) {
    const authHeader = req.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Please authenticate.' });
  }
};


module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).send('If that email exists, a reset link has been sent.');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); 
    await user.save();

    const resetUrl = `http://localhost:2000/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'cs.hmrtech@gmail.com',
        pass: 'sfyc zuto arbf fowe',
      },
    });

    const mailOptions = {
      to: user.email,
      from: 'cs.hmrtech@gmail.com',
      subject: 'Password Reset',
      text: `You requested a password reset. Click here to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "A password reset link has been sent to your email. Please verify it.",
      resetToken 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error.');
  }
};



module.exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        message: "Please input a valid or non-expired token."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: 'Password has been successfully reset.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error."
    });
  }
};