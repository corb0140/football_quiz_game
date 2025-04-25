const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authControllers");

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
// authRouter.post("/logout", authController.logout);
// authRouter.post("forgot-password", authController.forgotPassword);
// authRouter.post("/reset-password", authController.resetPassword);
// authRouter.post("refresh-token", authController.refreshToken);

module.exports = authRouter;
