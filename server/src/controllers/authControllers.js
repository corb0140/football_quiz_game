const jwt = require("jsonwebtoken");
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

    // 400 means bad request
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
      return res.status(401).json({ message: "Invalid email" });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });

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

const logout = async (req, res) => {
  try {
    /**
     * @description Clear the refresh token cookie
     * res.clearCookie() - This is an express method used to clear a cookie from the user's browser.
     * "refreshToken" - The name/key of the cookie to be cleared
     */
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    logger.error("Error in logout controller", error);
    return res.status(500).json({ message: "server error" });
  }
};

const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  // 401 means unauthorized
  if (!token)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    /**
     * @description jwt.verify() - This method verifies the token using the secret key.
     * token - The JWT token to be verified
     * process.env.REFRESH_TOKEN_SECRET - The secret key used to sign the token.
     * If the token is valid, it returns the decoded payload.
     */
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = {
      id: decoded.id,
      email: decoded.email,
    };

    // Generate new access token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update the refresh token in the cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Refresh token generated successfully",
      accessToken,
    });
  } catch (error) {
    logger.error("Error in refresh token controller", error);
    // 403 means forbidden
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
};
