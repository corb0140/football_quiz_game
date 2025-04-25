const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("./helpers/logger");

// IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");

// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/auth", authRoutes);

//SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
