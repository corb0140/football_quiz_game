import { useState } from "react";

export const useQuizSelection = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleQuizSelection = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setSelectedQuiz(null);
    setShowQuiz(false);
  };

  return {
    selectedQuiz,
    showQuiz,
    handleQuizSelection,
    handleCloseQuiz,
  };
};
