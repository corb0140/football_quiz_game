const pool = require("../config/db");

// GET /leaderboard/:type
async function getLeaderboard(req, res, next) {
  try {
    const { type } = req.params;
    const { rows } = await pool.query(
      `SELECT us.username, MAX(us.score) AS best_score
       FROM user_scores us
       JOIN quizzes q ON us.quiz_id = q.quiz_id
       WHERE q.type = $1
       GROUP BY us.username
       ORDER BY best_score DESC
       LIMIT 25`,
      [type]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// GET /leaderboard/overall
async function getOverallLeaderboard(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT username, AVG(score)::NUMERIC(10,2) AS avg_score
       FROM user_scores
       GROUP BY username
       ORDER BY avg_score DESC
       LIMIT 25`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLeaderboard,
  getOverallLeaderboard,
};
