import { CircleX } from "lucide-react";
import React from "react";

function Sidebar(props) {
  return (
    <div
      className={`fixed right-0 transform ${
        props.isOpen ? "-translate-x-0" : "translate-x-full"
      } transition duration-300 ease-in-out min-h-screen bg-blue-500 shadow-md w-70 z-10`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-dark-blue font-semibold text-xl">
          Football Quiz Game
        </h1>

        <CircleX
          className="h-6 w-6 text-white cursor-pointer hover:text-dark-blue hover:scale-110 transition duration-300"
          onClick={props.onClose}
        />
      </div>
    </div>
  );
}

export default Sidebar;
