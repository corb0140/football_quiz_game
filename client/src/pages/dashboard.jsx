import { UserData } from "../utils/user-data.js";
import Loader from "../components/Loader";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import { dashboardQuizCategories } from "../data/quiz-categories.js";
import { Award, Medal } from "lucide-react";

function Dashboard() {
  const { user, isLoading, error } = UserData();

  if (isLoading || error) {
    return <Loader isLoading={isLoading} error={error} />;
  }

  function getOrdinalSuffix(n) {
    const remainder = n % 100;
    if (remainder >= 11 && remainder <= 13) return "th";

    const lastDigit = n % 10;
    switch (lastDigit) {
      case 0:
        return "th";
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return (
    <div className="relative top-14 p-4 grid-custom gap-10">
      {/* WELCOME MESSAGE */}
      <div className="flex flex-col gap-3 row-span-1 lg:row-span-3">
        <h1 className="text-5xl font-light text-dark-blue">
          Hello,
          <span className="font-semibold"> {user?.username}!</span>
        </h1>
        <p className="font-light text-xl">
          Welcome to the football quiz game. Test your knowledge by completing
          various quizzes and see where you rank on the leaderboard
        </p>

        <Link
          to="/quizzes"
          className="flex lg:flex-grow items-center justify-center bg-bright-green py-4 md:py-6 lg:py-0 px-10 rounded-md 
          hover:text-dark-green transition duration-300
          text-2xl lg:text-5xl uppercase font-bold
          "
        >
          Play Now
        </Link>
      </div>

      {/* QUIZ CATEGORIES */}
      <Card className="row-span-3 mt-10 lg:mt-0 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Top Quiz Categories</h2>

        <div className="grid grid-cols-2 auto-rows-fr gap-3 flex-grow">
          {dashboardQuizCategories.map((category, index) => {
            const route = category.name.toLowerCase().split(" ").join("-");

            return (
              <div
                key={index}
                className="h-full w-full shadow-md bg-light-green rounded-md row-span-2"
              >
                <Link
                  to={`./quizzes/${route}`}
                  className="text-lg font-semibold text-white text-center flex flex-col items-center justify-center gap-1 h-full"
                >
                  {category.icon}
                  {category.name}
                </Link>
              </div>
            );
          })}
        </div>
      </Card>

      {/* LEADERBOARDS */}
      <Card className="bg-darker-green shadow-md row-span-3 lg:row-span-7 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Leaderboard</h2>

          <select
            className="border border-white py-2 px-3 rounded-md"
            defaultValue="overall"
          >
            <option value="overall">Overall Leaderboard</option>
            <option value="player">Player Leaderboard</option>
            <option value="player">League Leaderboard</option>
            <option value="player">WC Leaderboard</option>
            <option value="player">UCL Leaderboard</option>
          </select>
        </div>

        {/* MY POSITION */}
        <div className="flex items-center justify-between bg-light-green py-4 px-4 rounded-md">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-dark-green rounded-md"></div>

            <div>
              <p className="text-sm font-semibold">name</p>
              <p className="text-sm font-semibold">score</p>
            </div>
          </div>

          <p className="text-sm font-semibold self-start">
            1<sup>st</sup>
          </p>
        </div>

        {/* LEADERBOARD */}
        <div className="overflow-auto flex flex-col gap-2">
          {[...Array(100)].map((_, index) => {
            const position = index + 1;
            const ordinalSuffix = getOrdinalSuffix(position);

            return (
              <div
                key={index}
                className="flex items-center justify-between border border-light-green py-4 px-4 rounded-md"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-light-green"></div>

                  <div>
                    <p className="text-sm font-semibold">name</p>
                    <p className="text-sm font-semibold">score</p>
                  </div>
                </div>

                <p className="text-sm font-semibold self-start">
                  {position}
                  <sup>{ordinalSuffix}</sup>
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* USER STATS */}
      <Card className="row-span-1 lg:row-span-2 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Your Stats</h2>

        <div className="bg-light-green flex-grow rounded-md shadow-md">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm">Quizzes Played</p>
            <span className="text-sm">8</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm">Best Score</p>
            <span className="text-sm">10</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm">Average Score</p>
            <span className="text-sm">85%</span>
          </div>
        </div>
      </Card>

      {/* ACHIEVEMENTS / BADGES */}
      <Card className="bg-darker-green shadow-md row-span-3 lg:row-span-5 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-center gap-4">
          <Medal className="h-6 w-6 rounded-md" />
          <h2 className="text-2xl font-semibold uppercase text-center">
            Achievements
          </h2>
        </div>

        <div className="overflow-auto flex flex-col gap-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center border border-light-green py-4 px-4 rounded-md"
            >
              <div className="flex items-center gap-4">
                <Award className="h-8 w-8 rounded-md" />
                <div>
                  <p className="text-md font-bold ">Champions League Winner</p>
                  <p className="text-sm font-light">
                    Score a perfect score in a CL trivia
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
