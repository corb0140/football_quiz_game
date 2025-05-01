import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../pages/signup";
import Login from "../pages/login";
import ForgotPassword from "../pages/forgot-password";
import ResetPassword from "../pages/reset-password";
import Dashboard from "../pages/dashboard";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCredentials } from "../lib/state/authSlice";

function AppRouter() {
  const dispatch = useDispatch();
  const accessToken = Cookies.get("accessToken");

  if (accessToken) {
    console.log("Access token found in cookies:", accessToken);
    dispatch(setCredentials({ accessToken }));
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
export default AppRouter;
