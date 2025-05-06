import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import Cookies from "js-cookie";
import { UserData } from "../../utils/user-data";
import { Link } from "react-router-dom";

function PlayerTrivia() {
  const token = Cookies.get("accessToken");
  const { user } = UserData();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    axios.get("/quiz/player trivia").then((res) => {
      setQuiz(res.data);
    });
  }, []);

  useEffect(() => {
    if (showResult || !quiz || currentQuestionIdx >= quiz.questions.length)
      return;

    setTimer(5);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);

          if (selectedOptionId === null) {
            handleAnswer(null);
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [currentQuestionIdx, quiz, showResult]);

  //   HANDLE ANSWER
  const handleAnswer = (optionId) => {
    if (selectedOptionId !== null) return; // prevent multiple selections

    setSelectedOptionId(optionId);
    const question = quiz.questions[currentQuestionIdx];
    const correctOption = question.options.find((o) => o.is_correct);
    const isCorrect =
      optionId !== null &&
      correctOption &&
      correctOption.option_id === optionId;

    const updatedAnswers = [
      ...userAnswers,
      {
        question_id: question.question_id,
        option_id: optionId,
        is_correct: isCorrect,
      },
    ];

    setUserAnswers(updatedAnswers);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setIsAnswerCorrect(true);
    } else {
      setIsAnswerCorrect(false);
    }

    setTimeout(() => {
      if (currentQuestionIdx + 1 === quiz.questions.length) {
        submitQuiz(updatedAnswers);
      } else {
        setCurrentQuestionIdx((prev) => prev + 1);
        setSelectedOptionId(null);
        setIsAnswerCorrect(null);
      }
    }, 1000);
  };

  const submitQuiz = async (answers) => {
    try {
      if (quizAttempts >= 2) {
        setShowResult(true);
        return;
      }

      setQuizAttempts((prev) => prev + 1);

      const res = await axios.post(
        `/quiz/${quiz.quizId}/submit`,
        { answers, username: user.username },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const submittedScore = res.data.score;
      const percentage = (submittedScore / quiz.questions.length) * 100;

      let message = "";
      if (percentage === 100) {
        message = "Perfect score! 🎯 You're a trivia master!";
      } else if (percentage >= 80) {
        message = "Great job! 💪 You really know your stuff.";
      } else if (percentage >= 50) {
        message = "Not bad! 👍 Keep practicing to improve.";
      } else {
        message = "Better luck next time! 🙃 Give it another try.";
      }

      setFeedbackMsg(message);
      setScore(submittedScore);

      setShowResult(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (!quiz) return <div>Loading quiz...</div>;

  if (showResult) {
    return (
      <div className="p-4 flex flex-col gap-4 items-center">
        <h2 className="text-xl font-bold mb-4">Quiz Completed</h2>

        <p className="text-lg">
          Your Score: {score} / {quiz.questions.length}
        </p>

        <p className="text-md">{feedbackMsg}</p>

        {quizAttempts >= 2 ? (
          <p className="text-md text-red-600">
            You've reached the maximum number of attempts.
          </p>
        ) : (
          <button
            className="text-lg bg-bright-green py-3 w-40 text-center rounded"
            onClick={() => {
              setCurrentQuestionIdx(0);
              setScore(0);
              setSelectedOptionId(null);
              setUserAnswers([]);
              setShowResult(false);
              setIsAnswerCorrect(null);
            }}
          >
            Try Again
          </button>
        )}

        <Link
          className="text-lg bg-bright-green py-3 w-40 text-center rounded"
          to="/dashboard"
        >
          Dashboard
        </Link>
      </div>
    );
  }

  const question = quiz.questions[currentQuestionIdx];

  return (
    <div className="flex flex-col items-center gap-5 p-5">
      <h2 className="text-xl font-bold">Player Trivia</h2>
      <p className="text-md text-dark-green">
        Question {currentQuestionIdx + 1} of {quiz.questions.length}
      </p>
      <p className="text-lg">{question.question_text}</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
        {question.options.map((opt) => (
          <button
            key={opt.option_id}
            className={`text-dark-green text-lg font-bold w-full p-4 lg:p-6 border rounded ${
              selectedOptionId === opt.option_id
                ? isAnswerCorrect
                  ? "bg-green-300 border-green-600"
                  : "bg-red-300 border-red-600"
                : "bg-white"
            }`}
            onClick={() => handleAnswer(opt.option_id)}
            disabled={selectedOptionId !== null}
          >
            {opt.text}
          </button>
        ))}
      </div>
      <p className="text-lg">Time Remaining: {timer}s</p>
    </div>
  );
}

export default PlayerTrivia;
