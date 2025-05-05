import React from "react";
import { playerQuizzes } from "@/data/player-quizzes";
import { UserData } from "../../utils/user-data";
import Loader from "../../components/Loader";
import { useQuizSelection } from "../../utils/quiz-selection";

function PlayerTrivia() {
  const { user, isLoading, error } = UserData();
  const { selectedQuiz, showQuiz, handleQuizSelection, handleCloseQuiz } =
    useQuizSelection();

  if (isLoading || error) {
    return <Loader isLoading={isLoading} error={error} />;
  }

  return (
    <div className="relative top-14">
      {!showQuiz ? (
        <div className="p-2 flex flex-col gap-2 overflow-auto">
          <h2 className="text-2xl font-bold">Available Quizzes</h2>

          {playerQuizzes.map((quiz) => (
            <div
              key={quiz.quizId}
              className="flex items-center gap-4 border-2 border-bright-green h-20 p-4 w-full rounded-md overflow-hidden"
              onClick={() => handleQuizSelection(quiz)}
            >
              <img
                src={quiz.quizImage}
                alt={quiz.quizImageAlt}
                className="h-full object-contain"
              />

              <div className="flex flex-col ">
                <h3 className="font-bold">{quiz.quizName}</h3>
                <p className="font-light">{quiz.quizDescription}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-2 flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Selected Quiz</h2>

          <div className="flex items-center gap-2 border-2 border-bright-green h-30 p-5 w-full rounded-md overflow-hidden">
            <img
              src={selectedQuiz.quizImage}
              alt={selectedQuiz.quizImageAlt}
              className="h-full"
            />

            <p className="text-sm">{selectedQuiz.quizDescription}</p>
          </div>

          <button
            onClick={handleCloseQuiz}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Close Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default PlayerTrivia;
