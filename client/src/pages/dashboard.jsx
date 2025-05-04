import { useGetUserDataQuery } from "../lib/state/userApi.js";
import Lottie from "lottie-react";
import Loading from "@/Loading.json";
import Card from "../components/Card.jsx";
import { Link } from "react-router-dom";
import { dashboardQuizCategories } from "../data/quiz-categories.js";

function Dashboard() {
  const { data: userData, isLoading, error } = useGetUserDataQuery();
  const user = userData?.user;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Lottie animationData={Loading} loop={true} className="w-20 h-20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }
  return (
    <div className="relative top-14 p-4 grid-custom gap-10">
      <div className="flex flex-col gap-3 row-span-1">
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
          className="flex items-center justify-center bg-bright-green py-4 md:py-6 px-10 rounded-md 
          hover:text-dark-green transition duration-300
          text-2xl uppercase font-bold
          "
        >
          Play Now
        </Link>
      </div>

      {/* QUIZ CATEGORIES */}
      <Card className="border-light-green row-span-3 mt-10 p-5 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Top Quiz Categories</h2>

        <div className="grid grid-cols-2 grid-rows-[repeat(4,13vh)] gap-3">
          {dashboardQuizCategories.map((category, index) => (
            <div
              key={index}
              className="h-full w-full shadow-md bg-light-green rounded-md row-span-2"
            >
              <Link
                to={`/quizzes/${category.name}`}
                className="text-lg font-semibold text-white text-center flex flex-col items-center justify-center gap-1 h-full"
              >
                {category.icon}
                {category.name}
              </Link>
            </div>
          ))}
        </div>
      </Card>

      {/* LEADERBOARDS */}
      <Card className="bg-darker-green shadow-md row-span-2"></Card>

      {/* USER STATS */}
      <Card className="bg-light-green shadow-md row-span-2"></Card>

      {/* ACHIEVEMENTS / BADGES */}
      <Card className="bg-darker-green shadow-md row-span-2"></Card>
    </div>
  );
}

export default Dashboard;
