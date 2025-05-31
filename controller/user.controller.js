const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

console.log('User controller loaded');

// signup user

module.exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, lastname, email, password, passwordConfirm } = req.body;
    console.log('Signup request received:', { name, lastname, email });
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword
    });

    res.status(201).json({ data: newUser, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// login user 

module.exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // res.cookie('token', token);

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// get user profile

module.exports.getProfile = (req, res) => {
  try {
    res.status(200).json({
      message: 'User profile fetched successfully',
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// logout user

module.exports.logout = (req, res) => {
  try {
    res.clearCookie('token');

    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error during logout.' });
  }
};

// forgot password

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

// reset password

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

// get user profile by id

module.exports.getuserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User fetched successfully',
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// update user profile

module.exports.updateProfile = async (req, res) => {
  const userId = req.params.id;
  const { name, lastname, email } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      message: 'User profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// delete user profile

// module.exports.deleteProfile = async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     await user.destroy();

//     res.status(200).json({ message: 'User profile deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };




module.exports.deleteuser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



module.exports.searchUsers = async (req, res) => {
  const { query } = req.query;
  console.log(query);

  try {
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { lastname: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'name', 'lastname', 'email']
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
