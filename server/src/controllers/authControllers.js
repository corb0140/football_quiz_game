const bcrypt = require("bcrypt");
const pool = require("../config/db");
const logger = require("../helpers/logger");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/token");

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const { rows } = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)",
      [email]
    );

    if (rows[0].exists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const newUser = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    const user = newUser.rows[0];

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    /**
     * @description Set the refresh token in a cookie
     * res.cookie() - This is an express method used to set a cookie in the user's browser.
     * "refreshToken" - The name/key of the cookie
     * refreshToken - The value of the cookie, usually a JWT in this case.
     */
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: false, // Set to true if using HTTPS
      sameSite: "strict", // Set to 'none' if using cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days is how long the cookie will last
    });

    // Send access token
    // 201 means request was successful and new resource was created
    // .json converts the response to JSON format
    // sets the Content-Type header to application/json
    // and sends the JSON response to the client
    res.status(201).json({
      message: "User registered successfully",
      accessToken,
    });
  } catch (error) {
    logger.error("Error in register controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const user = rows[0];

    // check if email exists
    if (!user.email) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set the refresh token in a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 200 means request was success
    res.status(200).json({
      message: "User logged in successfully",
      accessToken,
    });
  } catch (error) {
    logger.error("Error in login controller", error);
    // 500 means server error
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  register,
  login,
};
