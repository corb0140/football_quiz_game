const pool = require("../config/db");

// GET /quiz/:type
async function getQuiz(req, res, next) {
  try {
    const { type } = req.params;
    // fetch quiz
    const quiz = await pool.query(
      `SELECT quiz_id FROM quizzes WHERE type = $1`,
      [type]
    );
    if (!quiz.rows.length)
      return res.status(404).json({ message: "Quiz not found" });

    const quizId = quiz.rows[0].quiz_id;

    // fetch questions with options
    const qRes = await pool.query(
      `SELECT q.question_id, q.question_text, json_agg(json_build_object('option_id', o.option_id, 'text', o.option_text)) AS options
       FROM questions q
       JOIN options o ON o.question_id = q.question_id
       WHERE q.quiz_id = $1
       GROUP BY q.question_id`,
      [quizId]
    );

    res.json({ quizId, questions: qRes.rows });
  } catch (err) {
    next(err);
  }
}

// POST /quiz/:quizId/submit
async function submitQuiz(req, res, next) {
  try {
    const { quizId } = req.params;
    const { answers } = req.body; // [{ question_id, option_id }, ...]
    const userId = req.user.id;
    const username = req.user.username;

    // calculate score
    let score = 0;
    for (const a of answers) {
      const opt = await pool.query(
        `SELECT is_correct FROM options WHERE option_id = $1`,
        [a.option_id]
      );
      if (opt.rows[0].is_correct) score++;
    }

    // save score or update existing
    const result = await pool.query(
      `INSERT INTO user_scores (quiz_id, user_id, username, score)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (quiz_id, user_id)
       DO UPDATE SET score = EXCLUDED.score, taken_at = NOW()
       RETURNING user_score_id`,
      [quizId, userId, username, score]
    );

    res.json({ userScoreId: result.rows[0].user_score_id, score });
  } catch (err) {
    next(err);
  }
}

// GET /quiz/leaderboard/:type
async function getLeaderboard(req, res, next) {
  try {
    const { type } = req.params;
    const lb = await pool.query(
      `SELECT us.username, MAX(us.score) AS best_score
       FROM user_scores us
       JOIN quizzes q ON us.quiz_id = q.quiz_id
       WHERE q.type = $1
       GROUP BY us.username
       ORDER BY best_score DESC
       LIMIT 10`,
      [type]
    );
    res.json(lb.rows);
  } catch (err) {
    next(err);
  }
}

// GET /quiz/leaderboard/overall
async function getOverallLeaderboard(req, res, next) {
  try {
    const lb = await pool.query(
      `SELECT username, AVG(score)::NUMERIC(10,2) AS avg_score
       FROM user_scores
       GROUP BY username
       ORDER BY avg_score DESC
       LIMIT 25`
    );
    res.json(lb.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { getQuiz, submitQuiz, getLeaderboard, getOverallLeaderboard };
