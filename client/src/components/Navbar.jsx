import React, { useState } from "react";
import logo from "../assets/imgs/logo.svg";
import { useNavigate } from "react-router-dom";
import { links } from "../data/nav-links";
import { Menu, Mail } from "lucide-react";

function Navbar(props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabWidth = 96; // Width of each tab
  const navigate = useNavigate();

  const handleTabClick = (index, link) => {
    setActiveIndex(index);

    navigate(link);
  };

  return (
    <div className="h-14 z-10 w-screen fixed px-10 flex items-center justify-between bg-dark-green shadow-sm">
      {/* LOGO & APP NAME */}
      <div className="flex items-center gap-2">
        <img src={logo} className="h-4 w-4" />

        <h2 className="text-white text-lg">Football Quiz Game</h2>
      </div>

      {/* LINKS */}
      <div className="relative hidden md2:block">
        <ul className="flex bg-bright-green rounded-full h-8 items-center relative">
          {/* Sliding indicator */}
          <div
            className="absolute h-full bg-darker-green rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: `${tabWidth}px`,
              transform: `translateX(${activeIndex * tabWidth}px)`,
            }}
          />

          {/* TABS */}
          {links.map((link, index) => (
            <li
              key={index}
              className="z-10 h-full w-24 flex items-center justify-center"
            >
              <button
                className="text-sm font-semibold h-full w-full flex items-center justify-center cursor-pointer"
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
      <div className="md2:flex items-center gap-2 cursor-pointer hidden">
        <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
          <Mail className="h-4 w-4 text-dark-green" />
        </div>

        <img
          src="https://picsum.photos/200/300"
          alt="Profile"
          className="rounded-full h-8 w-8"
        />
      </div>

      {/* HAMBURGER MENU */}
      <Menu
        className="h-6 w-6 text-white md2:hidden cursor-pointer"
        onClick={() => {
          props.toggle(true);
        }}
      />
    </div>
  );
}

export default Navbar;
