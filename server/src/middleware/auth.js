const jwt = require("jsonwebtoken");

/**
 *  Middleware to authenticate users using JWT
 *  @param {Object} req - The request object
 *  @param {Object} res - The response object
 *  @param {Function} next - The next middleware function
 *  @returns {Object} - Returns a JSON response with user information or an error message
 *
 *  This middleware checks for the presence of a JWT in the request headers.
 *  It verifies the token using a secret key and, if valid, attaches the user information to the request object.
 *  If the token is missing or invalid, it sends a 401 Unauthorized or 403 Forbidden response.
 *  The token is expected to be in the format "Bearer <token>" in the Authorization header.
 *
 */
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the header

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded; // Attach the user information to the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Access token expired" });
  }
};

module.exports = authenticateUser;
