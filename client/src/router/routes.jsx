import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../pages/signup";
import Login from "../pages/login";
import ForgotPassword from "../pages/forgot-password";
import ResetPassword from "../pages/reset-password";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}
export default AppRouter;
