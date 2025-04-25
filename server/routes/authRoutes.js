const express = require("express");
const router = express.Router();
import authController from "../controllers/authController.js";

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("refresh-token", authController.refreshToken);
