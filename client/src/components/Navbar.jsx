import React from "react";
import logo from "../assets/imgs/logo.svg";
import { Link } from "react-router-dom";
import { links } from "../data/nav-links";
import { useGetUserDataQuery } from "../lib/state/userApi";
import Lottie from "lottie-react";
import Loading from "@/Loading.json";

function Navbar() {
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
    <div className="h-18 w-screen fixed shadow-sm px-10 flex items-center justify-between">
      {/* LOGO & APP NAME */}
      <div className="flex items-center gap-2">
        <img src={logo} className="h-4 w-4" />

        <h2 className="font-roboto-condensed text-white text-lg">
          Football Quiz Game
        </h2>
      </div>

      {/* LINKS */}
      <ul className="flex gap-8">
        {links.map((link, index) => (
          <li
            key={index}
            className="text-white font-roboto-condensed text-lg cursor-pointer"
          >
            <Link to={link.link}>{link.name}</Link>
          </li>
        ))}
      </ul>

      {/* PROFILE IMAGE & NAME */}
      <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
        <img
          src="https://picsum.photos/200/300"
          alt="Profile"
          className="rounded-full h-8 w-8"
        />
        <span className="text-white font-roboto-condensed text-lg">
          {user?.username}
        </span>
      </Link>
    </div>
  );
}

export default Navbar;
