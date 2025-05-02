import React, { useState } from "react";
import { ArrowLeft, Eye, EyeClosed } from "lucide-react";
import { css, keyframes } from "@emotion/react";
import { Link } from "react-router-dom";
import { useSignupMutation } from "../lib/state/authApi";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCredentials } from "../lib/state/authSlice";
import logo from "../assets/imgs/logo.svg";
import formImage from "../assets/imgs/form_image.jpg";

const loginButtonAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(40%);
  }
`;

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await signup({
        username,
        email,
        password,
      }).unwrap();
      console.log("Signup successful:", response);

      const accessToken = Cookies.get("accessToken");

      if (accessToken) {
        console.log("Access token found in cookies:", accessToken);
        dispatch(setCredentials({ accessToken }));
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const focusInputClass =
    "relative border border-gray-200 pl-4 h-16 w-full flex flex-col focus-within:border-dark-blue before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-dark-blue before:scale-x-0 focus-within:before:scale-x-100 before:origin-left before:transition-all before:duration-300";

  return (
    <div className="h-full w-full py-5 flex justify-center">
      <div className="h-full w-[70%] flex rounded">
        {/* LEFT */}
        <div
          style={{ backgroundImage: `url(${formImage})` }}
          className="h-full w-1/2 bg-cover bg-center bg-no-repeat rounded-tl rounded-bl"
        ></div>

        {/* RIGHT */}
        <div className="flex flex-col h-full w-1/2 p-10 gap-8 bg-white rounded-tr rounded-br">
          {/* TITLE & LOGO */}
          <div className="flex items-center justify-start gap-5">
            <img src={logo} alt="Logo" className="h-8 w-8 mt-3" />
            <h1 className="text-center text-2xl font-bold mt-4 font-roboto-condensed">
              Football Quiz Game
            </h1>
          </div>

          {/* DETAIL */}
          <p className="font-semibold text-3xl text-start font-roboto-condensed">
            Test your knowledge of the beautiful sport of football
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSignup}
            className="bg-white h-auto w-full flex flex-col items-start gap-4"
          >
            <p className="opacity-50 text-start font-roboto-condensed">
              Welcome! Please signup to continue to the game.
            </p>

            <div className="w-full">
              {/* USERNAME */}
              <div className={`${focusInputClass} rounded-t`}>
                <div className="h-1/2 w-full flex items-center justify-start">
                  <p className="text-start opacity-50 text-sm font-semibold font-roboto-condensed">
                    Username
                  </p>
                </div>

                <input
                  type="text"
                  className="w-full h-1/2 bg-transparent outline-none font-roboto-condensed"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className={focusInputClass}>
                <div className="h-1/2 w-full flex items-center justify-start">
                  <p className="text-start opacity-50 text-sm font-semibold font-roboto-condensed">
                    Email Address
                  </p>
                </div>

                <input
                  type="text"
                  className="w-full h-1/2 bg-transparent outline-none font-roboto-condensed"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className={`${focusInputClass} rounded-b`}>
                <div className="h-1/2 w-full flex items-center justify-start">
                  <p className="text-start opacity-50 text-sm font-semibold font-roboto-condensed">
                    Password
                  </p>
                </div>

                <div className="flex items-center justify-between w-full h-1/2">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="bg-transparent outline-none font-roboto-condensed"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="mr-2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeClosed className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* SIGNUP BUTTON */}
            <button
              disabled={isLoading}
              type="submit"
              className="bg-dark-blue text-white font-semibold text-lg w-full h-11 rounded hover:text-blue-500
              transition duration-500 cursor-pointer"
            >
              <p className="uppercase tracking-wider font-roboto-condensed">
                Signup
              </p>
            </button>
          </form>

          <p className="text-sm font-roboto-condensed opacity-70 text-start">
            By signing up, you agree to give me your soul should you score below
            80 in any quiz.
          </p>

          <Link
            to="/"
            className="inline-flex w-fit items-center gap-4 cursor-pointer"
            css={css`
              &:hover .arrow {
                animation: ${loginButtonAnimation} 0.8s infinite alternate;
              }
            `}
          >
            <ArrowLeft className="h-5 w-5 text-dark-blue arrow" />
            <p>Back to login screen</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
