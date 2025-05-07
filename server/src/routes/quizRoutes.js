const { Router } = require("express");
const quizRouter = Router();
const { getQuiz, submitQuiz } = require("../controllers/quizControllers");
const authenticateUser = require("../middleware/auth");

quizRouter.get("/:type", authenticateUser, getQuiz);

quizRouter.post("/:quizId/submit", authenticateUser, submitQuiz);

module.exports = quizRouter;
