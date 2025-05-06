const { Router } = require("express");
const quizRouter = Router();
const {
  getQuiz,
  submitQuiz,
  getLeaderboard,
  getOverallLeaderboard,
} = require("../controllers/quizControllers");
const authenticateUser = require("../middleware/auth");

quizRouter.get("/:type", authenticateUser, getQuiz);

quizRouter.post("/:quizId/submit", authenticateUser, submitQuiz);

quizRouter.get("/leaderboard/:type", getLeaderboard);

quizRouter.get("/leaderboard/overall", getOverallLeaderboard);

module.exports = quizRouter;
