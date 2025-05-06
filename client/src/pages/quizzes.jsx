import React from "react";
import FootballField from "../assets/imgs/football_field.jpg";
import Loader from "../components/Loader";
import { UserData } from "../utils/user-data";
import { Link } from "react-router-dom";

function Quizzes() {
  const { user, isLoading, error } = UserData();

  if (isLoading || error) {
    return <Loader isLoading={isLoading} error={error} />;
  }

  return (
    <div className="relative top-14 h-[calc(100vh-56px)] py-10 flex flex-col items-center justify-center">
      <div
        className="border-3 border-bright-green rounded-lg shadow-md bg-light-green overflow-hidden h-full 
        w-[80%] md2:w-[70%] lg:w-[60%] xl:w-1/2 relative"
      >
        <div className="bg-black/60 absolute top-0 h-full w-full z-10"></div>

        {/* IMAGE */}
        <div className="relative flex flex-col w-full h-1/3 overflow-hidden">
          <img
            src={FootballField}
            className="h-full w-full object-cover"
            alt="football field at night"
          />

          <div className="absolute z-10 h-full w-full flex flex-col gap-2 items-center justify-center">
            <img
              src="https://picsum.photos/200/300"
              alt="User Avatar"
              className="rounded-full h-20 w-20"
            />

            <p className="text-white text-2xl font-semibold">{user.username}</p>
          </div>
        </div>

        {/* GRID */}
        <div className="absolute z-10 flex flex-col gap-2 w-full h-2/3 p-4">
          <p>Quizzes</p>

          <div className="grid grid-cols-2 md2:grid-cols-3 auto-rows-fr flex-grow gap-4">
            {[...Array(6)].map((_, index) => (
              <Link
                to={`/quizzes/${index + 1}`}
                key={index}
                className="bg-light-green rounded-lg shadow-md flex items-center justify-center"
              >
                <p className="text-lg font-semibold">Quiz {index + 1}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quizzes;
