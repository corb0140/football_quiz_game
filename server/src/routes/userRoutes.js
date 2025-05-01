const { Router } = require("express");
const { getUserData } = require("../controllers/userController");
const authenticateUser = require("../middleware/auth");

const userRouter = Router();

userRouter.get("/me", authenticateUser, getUserData);

module.exports = userRouter;
