import React, { useState } from "react";
import logo from "../assets/imgs/logo.svg";
import { useNavigate } from "react-router-dom";
import { links } from "../data/nav-links";
import { Mail } from "lucide-react";

function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabWidth = 96; // Width of each tab
  const navigate = useNavigate();

  const handleTabClick = (index, link) => {
    setActiveIndex(index);

    navigate(link);
  };

  return (
    <div className="h-14 w-screen fixed px-10 flex items-center justify-between">
      {/* LOGO & APP NAME */}
      <div className="flex items-center gap-2">
        <img src={logo} className="h-4 w-4" />

        <h2 className="font-roboto-condensed text-white text-lg">
          Football Quiz Game
        </h2>
      </div>

      {/* LINKS */}
      <div className="relative">
        <ul className="flex bg-white rounded-full h-8 items-center relative">
          {/* Sliding indicator */}
          <div
            className="absolute h-full bg-blue-500 rounded-full shadow-lg transition-all duration-300 ease-in-out"
            style={{
              width: `${tabWidth}px`,
              transform: `translateX(${activeIndex * tabWidth}px)`,
            }}
          />

          {/* TABS */}
          {links.map((link, index) => (
            <li
              key={index}
              className="z-10 font-roboto-condensed h-full w-24 flex items-center justify-center"
            >
              <button
                className="font-roboto-condensed text-sm font-semibold h-full w-full flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick(index, link.link);
                }}
              >
                {link.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* PROFILE IMAGE & NAME */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
          <Mail className="h-4 w-4" />
        </div>

        <img
          src="https://picsum.photos/200/300"
          alt="Profile"
          className="rounded-full h-8 w-8"
        />
      </div>
    </div>
  );
}

export default Navbar;
