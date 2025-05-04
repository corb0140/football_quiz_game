import {
  GiSoccerKick,
  GiSoccerBall,
  GiWorld,
  GiChampions,
} from "react-icons/gi";
import { createElement } from "react";

export const dashboardQuizCategories = [
  {
    icon: createElement(GiSoccerKick, { className: "h-6 w-6" }),
    name: "Player Trivia",
  },
  {
    icon: createElement(GiSoccerBall, { className: "h-6 w-6" }),
    name: "League Trivia",
  },
  {
    icon: createElement(GiWorld, { className: "h-6 w-6" }),
    name: "World Cup Trivia",
  },
  {
    icon: createElement(GiChampions, { className: "h-6 w-6" }),
    name: "Champions League Trivia",
  },
];
