import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./private-route";
import Layout from "../components/Layout";

import Signup from "../pages/signup";
import Login from "../pages/login";
import ForgotPassword from "../pages/forgot-password";
import ResetPassword from "../pages/reset-password";
import Dashboard from "../pages/dashboard";
import Settings from "../pages/settings";
import Quizzes from "../pages/quizzes";
import Leaderboards from "../pages/leaderboards";
import Contact from "../pages/contact";
import PlayerTrivia from "../pages/quizzes/player-trivia";

function AppRouter() {
  const publicRoutes = [
    { path: "/", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
  ];

  const protectedRoutes = [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "dashboard/quizzes/player-trivia", element: <PlayerTrivia /> },
    { path: "/settings", element: <Settings /> },
    { path: "/quizzes", element: <Quizzes /> },
    { path: "/leaderboards", element: <Leaderboards /> },
    { path: "/contact", element: <Contact /> },
  ];

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* Protected Routes with Layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {protectedRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
