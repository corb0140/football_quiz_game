const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("./helpers/logger");

// IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

// ROUTES
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/quiz", quizRoutes);
app.use("/leaderboard", leaderboardRoutes);

//SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
