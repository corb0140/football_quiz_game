import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../lib/state/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../lib/state/authSlice";
import { useNavigate } from "react-router-dom";
import formImage from "../assets/imgs/form_image.jpg";
import logo from "../assets/imgs/logo.svg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ username, password }).unwrap();
      console.log("Login response:", response);
      dispatch(
        setCredentials({
          accessToken: response.accessToken,
        })
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const focusInputClass =
    "relative border border-gray-200 pl-4 h-16 w-full flex flex-col focus-within:border-dark-blue before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-dark-blue before:scale-x-0 focus-within:before:scale-x-100 before:origin-left before:transition-all before:duration-300";

  return (
    <div className="h-full w-full py-5 flex justify-center text-black">
      <div className="h-full w-[70%] flex">
        {/* LEFT */}
        <div
          style={{ backgroundImage: `url(${formImage})` }}
          className="hidden h-full w-1/2 bg-cover bg-center bg-no-repeat rounded-tl rounded-bl
        lg:block"
        ></div>

        {/* RIGHT */}
        <div className="flex flex-col h-full lg:w-1/2 p-10 gap-8 bg-white lg:border not-lg:shadow-lg not-lg:rounded lg:rounded-tr lg:rounded-br">
          {/* TITLE & LOGO */}
          <div className="flex items-center justify-start gap-5">
            <img src={logo} alt="Logo" className="h-8 w-8 mt-3" />
            <h1 className="text-center text-2xl font-bold mt-4 ">
              Football Quiz Game
            </h1>
          </div>

          {/* DETAIL */}
          <p className="font-semibold text-3xl text-start ">
            Test your knowledge of the beautiful sport of football
          </p>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="bg-white h-auto w-full flex flex-col items-start gap-4"
          >
            <p className="opacity-50 text-start ">
              Welcome back! Please login to continue to the game.
            </p>
            <div className="w-full">
              {/* USERNAME */}
              <div className={`${focusInputClass} rounded-t`}>
                <div className="h-1/2 w-full flex items-center justify-start">
                  <p className="text-start opacity-50 text-sm font-semibold ">
                    Username
                  </p>
                </div>

                <input
                  type="text"
                  className="w-full h-1/2 bg-transparent outline-none "
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className={`${focusInputClass} rounded-b`}>
                <div className="h-1/2 w-full flex items-center justify-start">
                  <p className="text-start opacity-50 text-sm font-semibold ">
                    Password
                  </p>
                </div>

                <div className="flex items-center justify-between w-full h-1/2">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="bg-transparent outline-none "
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

            <button
              onClick={() => console.log("10")}
              type="button"
              className="text-sm font-semibold self-end  cursor-pointer"
            >
              Forgot Password
            </button>

            {/* BUTTONS */}
            <div className="flex gap-5">
              <button
                disabled={isLoading}
                type="submit"
                className="bg-dark-green text-white font-semibold text-lg w-full h-11 rounded
                hover:text-bright-green transition duration-300 cursor-pointer py-4 px-8 flex items-center"
              >
                <p className="uppercase tracking-wider ">Login</p>
              </button>

              <Link
                to="/signup"
                className="group border-2 border-dark-green text-dark-green font-semibold text-lg w-full h-11 rounded 
                   transition duration-500 cursor-pointer py-4 px-8 flex items-center"
              >
                <p className="uppercase tracking-wider text-dark-green group-hover:text-bright-green transition duration-500">
                  Signup
                </p>
              </Link>
            </div>
          </form>

          {/* Message */}
          <p className="text-sm  opacity-70 text-start">
            By logging in, you agree to give me your soul should you score below
            80 in any quiz.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
