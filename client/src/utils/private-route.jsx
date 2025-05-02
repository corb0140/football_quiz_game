import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCredentials } from "../lib/state/authSlice";

/**
 * PrivateRoute component checks if the user is authenticated by checking for a token in cookies.
 * If the token is not present, it redirects the user to the login page.
 * If the token is present, it renders the children components.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to render if authenticated.
 *
 * @returns {ReactNode} - The child components or a redirect to the login page.
 */
const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const token = Cookies.get("accessToken");

  if (!token) {
    /**
     * replace tells the router to replace the current entry in the history stack with the new one
     * @reason without replace, the user can go back to the private route using the back button
     * With replace, the browser acts as if the user was always on the login page, preventing going back to protected route
     */
    return <Navigate to="/" replace />;
  } else {
    dispatch(
      setCredentials({
        accessToken: token,
      })
    );
  }

  return children;
};

export default PrivateRoute;
