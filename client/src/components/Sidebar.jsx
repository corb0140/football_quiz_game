import { CircleX, Mail } from "lucide-react";
import { links } from "../data/nav-links";
import { Link } from "react-router-dom";
import { useGetUserDataQuery } from "../lib/state/userApi";

function Sidebar(props) {
  const { data: userData } = useGetUserDataQuery();
  const username = userData?.user.username || "Username";

  return (
    <div
      className={`fixed right-0 transform md2:hidden ${
        props.isOpen ? "-translate-x-0" : "translate-x-full"
      } transition duration-300 ease-in-out min-h-screen bg-white shadow-lg w-70 z-10`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-dark-blue font-semibold text-xl">
          Football Quiz Game
        </h1>

        <CircleX
          className="h-6 w-6 text-black cursor-pointer hover:text-dark-blue hover:scale-110 transition duration-300"
          onClick={props.onClose}
        />
      </div>

      <div className="flex flex-col gap-10 items-center justify-center">
        {/* PROFILE IMAGE & NAME */}
        <div className="flex flex-col items-center justify-center gap-2">
          <img
            src="https://picsum.photos/200/300"
            alt="Profile"
            className="rounded-full h-30 w-30"
          />

          {/* USERNAME */}
          <p className="text-dark-blue text-lg font-semibold">{username}</p>

          {/* EMAIL */}

          <Mail className="h-6 w-6 text-dark-blue" />
        </div>

        {/* LINKS */}
        <ul className="flex flex-col rounded-full items-center justify-center gap-4">
          {/* TABS */}
          {links.map((link, index) => (
            <li
              key={index}
              className="w-50 py-2 border-3 border-dark-blue hover-rounded-animation flex items-center justify-center cursor-pointer"
            >
              <Link
                to={link.link}
                onClick={() => props.onClose()}
                className="h-full w-full text-dark-blue text-lg font-semibold flex items-center justify-center"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
