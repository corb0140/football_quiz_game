const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const logger = require("../helpers/logger");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/token");
const generateResetToken = require("../helpers/generateResetToken");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const { rows } = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1 OR username = $2)",
      [email, username]
    );

    // 400 means bad request
    if (rows[0].exists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email",
      [username, email, hashedPassword]
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

    // Set the access token in a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes for the access token, for example
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
  const { username, password } = req.body;

  try {
    // Find user by username
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    const user = rows[0];

    // check if username exists
    if (!user.username) {
      return res.status(401).json({ message: "This user does not exit" });
    }

    // Compare passwords
    // 401 means unauthorized
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
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

    // Set the access token in a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes for the access token, for example
    });

    // 200 means request was success
    res.status(200).json({
      message: "User logged in successfully",
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
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

    // Set the new access token in the cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: false, // Set to true if using HTTPS
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes for the access token
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    const user = rows[0];

    // 404 means not found
    if (!user)
      return res.status(404).json({ message: "No user found with that email" });

    // Generate reset token
    const { resetToken, hashedToken } = generateResetToken();

    // set expiration time for the token
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save hashed token + expiration time to the database
    await pool.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3",
      [hashedToken, expirationTime, email]
    );

    res.status(200).json({
      message: "Password reset token generated",
      resetToken, // In production you'd send this by email
    });
  } catch (error) {
    logger.error("Error in forgot password controller", error);
    return res.status(500).json({ message: "server error" });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword)
    return res
      .status(400)
      .json({ message: "Reset token and new password are required" });

  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()",
      [hashedToken]
    );

    const user = rows[0];

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });

    /**
     * @description salt - A random string added to the password before hashing to make it more secure.
     * bcrypt.genSalt() - This method generates a salt with the specified number of rounds (10 in this case).
     * The higher the number of rounds, the more secure the hash will be, but it will also take longer to compute.
     * 10 rounds is a good balance between security and performance.
     */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password in the database and clear reset fields
    await pool.query(
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    logger.error("Error in reset password controller", error);
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
};
