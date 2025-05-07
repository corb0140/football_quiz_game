const { Router } = require("express");
const leaderboardRouter = Router();
const {
  getLeaderboard,
  getOverallLeaderboard,
} = require("../controllers/leaderboardController");

leaderboardRouter.get("/:type", getLeaderboard);

leaderboardRouter.get("/overall", getOverallLeaderboard);

module.exports = leaderboardRouter;
