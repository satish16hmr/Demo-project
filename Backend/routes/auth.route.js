import express from "express";
import { body } from "express-validator";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("passwordConfirm").exists(),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  authController.login
);

router.get("/profile", authMiddleware, authController.getProfile);

router.post("/logout", authController.logout);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

export default router;
