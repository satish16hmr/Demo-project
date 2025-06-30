import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";
import Follow from "../models/follow.model.js";
import Notification from "../models/notification.model.js";
import NotificationService from "../services/user.service.js";
import userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import { Sequelize } from "sequelize";

// signup user
async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, lastname, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords does not match" });
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await userService.createUser({
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

// login user
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token);

    // res.cookie("user",user);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// get user profile
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

// logout user
async function logout(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error during logout." });
  }
}

// forgot password
async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res
        .status(200)
        .send("If that email exists, a reset link has been sent.");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();

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
      text: `You requested a password reset. Click here to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message:
        "A password reset link has been sent to your email. Please verify it.",
      resetToken,
    });
  } catch (error) {
    return res.status(500).send("Server error.");
  }
}

// reset password
async function resetPassword(req, res) {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Please input a valid or non-expired token.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been successfully reset." });
  } catch (error) {
    return res.status(500).json({
      message: "Server error.",
    });
  }
}

// get user profile by id
async function getUserById(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// update user profile
async function updateProfile(req, res) {
  const userId = req.params.id;
  const { name, lastname, email } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.name = name || user.name;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;

    await user.save();

    return res.status(200).json({
      message: "User profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// delete user profile
async function deleteUser(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Like.destroy({ where: { userId } });
    await Comment.destroy({ where: { userId } });
    await Post.destroy({ where: { author: userId } });
    await Follow.destroy({
      where: {
        [Op.or]: [{ follower_id: userId }, { following_id: userId }],
      },
    });
    await Notification.destroy({ where: { userId } });

    await user.destroy();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// search users
async function searchUsers(req, res) {
  const { query } = req.query;
  try {
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    const users = await userService.searchUsers(query);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// follow user
async function followUser(req, res) {
  const follower_id = req.user.id;
  const following_id = parseInt(req.params.id);

  if (follower_id === following_id) {
    return res.status(400).json({ message: "You can't follow yourself." });
  }

  try {
    await userService.followUser(follower_id, following_id);

    const notification = await NotificationService.createNotification({
      userId: following_id,
      fromUserId: follower_id,
      type: "follow",
      message: "started following you",
    });

    return res.status(200).json({
      message: "User followed successfully.",
      notification,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message || "Server error." });
  }
}

// unfollow user
async function unfollowUser(req, res) {
  const follower_id = req.user.id;
  const following_id = parseInt(req.params.id);

  if (follower_id === following_id) {
    return res.status(400).json({ message: "You can't unfollow yourself." });
  }

  try {
    await userService.unfollowUser(follower_id, following_id);
    return res.status(200).json({ message: "User unfollowed successfully." });
  } catch (err) {
    return res.status(400).json({ message: err.message || "Server error." });
  }
}

// get followers
async function getFollowers(req, res) {
  const userId = parseInt(req.params.id);
  try {
    const followers = await userService.getFollowers(userId);
    return res.status(200).json({ followers });
  } catch (err) {
    return res.status(500).json({
      message: "Server error while fetching followers.",
      error: err.message,
    });
  }
}

// get following
async function getFollowing(req, res) {
  const userId = parseInt(req.params.id);
  try {
    const following = await userService.getFollowing(userId);
    return res.status(200).json({ following });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "lastname",
        "email",
        [
          Sequelize.literal(`(
          SELECT COUNT(*) FROM "Posts" AS posts WHERE posts.author = "User".id
        )`),
          "postCount",
        ],
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getNotifications(req, res) {
  const userId = req.user.id;

  try {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "fromUser",
          attributes: ["id", "name", "lastname"],
        },
      ],
    });

    return res.status(200).json({
      notifications: notifications.map((notification) => ({
        id: notification.id,
        type: notification.type,
        message: notification.message,
        fromUser: notification.fromUser
          ? {
              id: notification.fromUser.id,
              name: notification.fromUser.name,
              lastname: notification.fromUser.lastname,
            }
          : null,
        createdAt: notification.createdAt,
      })),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error while fetching notifications." });
  }
}

async function deleteNotification(req, res) {
  const notificationId = req.params.id;
  const userId = req.user.id;

  try {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId },
    });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();
    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

const userController = {
  signup,
  login,
  getProfile,
  logout,
  forgotPassword,
  resetPassword,
  getUserById,
  updateProfile,
  deleteUser,
  searchUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getNotifications,
  deleteNotification,
  getAllUsers,
};

export default userController;
