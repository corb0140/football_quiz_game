const jwt = require("jsonwebtoken");

/* 
A JWT(json web token) is a digitally signed token that contains data (like your user ID or email), and it can expire after some time. 
It's used to identify you when you make requests to a server.
*/

/**
 * @description Generate an access token for a user that lasts for 10 minutes
 * it's used when you're logged in and need to access protected routes
 * @param {Object} user - The user object containing user information
 * @returns {string} - The generated access token
 * @throws {Error} - Throws an error if the token generation fails
 * @example
 * generateAccessToken({ id: 1, email: "me@example.com" });
 * // returns something like "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * This is the JWT. It's a signed, encoded message with your user info inside.
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10m",
    }
  );
};

/**
 * @description Generate a refresh token for a user. This is a your longer-lasting backup token
 * It creates a token that lasts for 7 days
 * and is used to get a new access token when the old one expires
 * @param {Object} user - The user object containing user information
 * @returns {string} - The generated refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
