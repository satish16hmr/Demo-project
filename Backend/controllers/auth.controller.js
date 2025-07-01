import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import authService from "../services/auth.service.js";

// Signup
async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, lastname, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const newUser = await authService.createUser({
      name,
      lastname,
      email,
      password,
    });

    return res
      .status(201)
      .json({ data: newUser, message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Login
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await authService.verifyUser(email, password);
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get current logged-in user's profile
async function getProfile(req, res) {
  try {
    res.status(200).json({
      message: "User profile fetched successfully",
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// Logout
async function logout(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error during logout." });
  }
}

// Forgot Password
async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await authService.findUserByEmail(email);
    if (!user)
      return res
        .status(200)
        .send("If that email exists, a reset link has been sent.");

    const resetToken = crypto.randomBytes(20).toString("hex");
    await authService.saveResetToken(user, resetToken);

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "cs.hmrtech@gmail.com",
        pass: "sfyc zuto arbf fowe",
      },
    });

    const mailOptions = {
      to: user.email,
      from: "cs.hmrtech@gmail.com",
      subject: "Password Reset",
      text: `You requested a password reset. Click here:\n\n${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "A password reset link has been sent to your email.",
      resetToken,
    });
  } catch (error) {
    return res.status(500).send("Server error.");
  }
}

// Reset Password
async function resetPassword(req, res) {
  const { token, password } = req.body;
  try {
    const user = await authService.findUserByResetToken(token);
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });

    await authService.updateUserPassword(user, password);

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
}

export default {
  signup,
  login,
  getProfile,
  logout,
  forgotPassword,
  resetPassword,
};
