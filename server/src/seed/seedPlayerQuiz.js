const pool = require("../config/db");
const questions = require("../data/player-questions-spain");

async function seedPlayerQuiz() {
  try {
    // Create or find the quiz
    const { rows } = await pool.query(
      `INSERT INTO quizzes(type) VALUES($1) ON CONFLICT(type) DO UPDATE SET type=EXCLUDED.type RETURNING quiz_id`,
      ["player trivia"]
    );
    const quizId = rows[0].quiz_id;

    // Insert questions and options
    for (const q of questions) {
      const qRes = await pool.query(
        `INSERT INTO questions(quiz_id, question_text) VALUES($1, $2) RETURNING question_id`,
        [quizId, q.text]
      );

      const qId = qRes.rows[0].question_id;

      for (const opt of q.options) {
        await pool.query(
          `INSERT INTO options(question_id, option_text, is_correct) VALUES($1, $2, $3)`,
          [qId, opt.text, opt.correct]
        );
      }
    }

    console.log("Player quiz seeded, quiz_id =", quizId);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedPlayerQuiz();
