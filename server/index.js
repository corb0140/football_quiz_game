import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// IMPORT ROUTES

// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api", authRoutes);

//SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
