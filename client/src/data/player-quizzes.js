import { v4 as uuidv4 } from "uuid";
import Spain from "@/assets/flags/4x3/es.svg";
import England from "@/assets/flags/4x3/gb-eng.svg";

export const playerQuizzes = [
  {
    quizId: uuidv4(),
    quizName: "Player Trivia 1 - Spain",
    quizCategory: "Player Trivia",
    quizDescription: "Test your knowledge about football players in Spain",
    quizImage: Spain,
    quizImageAlt: "Spain Flag",
  },
  {
    quizId: uuidv4(),
    quizName: "Player Trivia 2 - England",
    quizCategory: "Player Trivia",
    quizDescription: "Test your knowledge about football players in England",
    quizImage: England,
    quizImageAlt: "England Flag",
  },
];
