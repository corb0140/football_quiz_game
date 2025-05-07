const pool = require("../config/db");
const logger = require("../helpers/logger");

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
      `SELECT q.question_id, q.question_text, json_agg(json_build_object('option_id', o.option_id, 'text', o.option_text, 'is_correct', o.is_correct)) AS options
       FROM questions q
       JOIN options o ON o.question_id = q.question_id
       WHERE q.quiz_id = $1
       GROUP BY q.question_id`,
      [quizId]
    );

    // fetch attempts
    const userId = req.user?.id; // optional chaining in case it's public

    let attempts = 0;
    if (userId) {
      const userScore = await pool.query(
        `SELECT attempts FROM user_scores WHERE quiz_id = $1 AND user_id = $2`,
        [quizId, userId]
      );
      if (userScore.rows.length) {
        attempts = userScore.rows[0].attempts;
      }
    }

    res.json({ quizId, questions: qRes.rows, attempts });
  } catch (err) {
    next(err);
  }
}

// POST /quiz/:quizId/submit
async function submitQuiz(req, res, next) {
  try {
    const { quizId } = req.params;
    const { answers, username } = req.body;
    const userId = req.user.id;

    // calculate score
    let score = 0;
    for (const a of answers) {
      const opt = await pool.query(
        `SELECT is_correct FROM options WHERE option_id = $1`,
        [a.option_id]
      );
      if (opt.rows.length === 0) {
        console.warn(`No option found for option_id: ${a.option_id}`);
        continue; // or return an error if this should never happen
      }

      if (opt.rows[0].is_correct) score++;
    }

    // fetch attempts
    const userScore = await pool.query(
      `SELECT attempts FROM user_scores WHERE quiz_id = $1 AND user_id = $2`,
      [quizId, userId]
    );
    let attempts = 0;
    if (userScore.rows.length) {
      attempts = userScore.rows[0].attempts;
    }
    logger.info(attempts);

    // save score or update existing
    const result = await pool.query(
      `INSERT INTO user_scores (quiz_id, user_id, username, score, attempts)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (quiz_id, user_id)
       DO UPDATE SET score = EXCLUDED.score, attempts = EXCLUDED.attempts, taken_at = NOW()
       RETURNING user_score_id`,
      [quizId, userId, username, score, attempts + 1]
    );

    res.json({ userScoreId: result.rows[0].user_score_id, score });
  } catch (err) {
    next(err);
  }
}

module.exports = { getQuiz, submitQuiz };
