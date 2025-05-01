const pool = require("../config/db");
const logger = require("../helpers/logger");

const getUserData = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { rows } = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [userId]
    );

    const user = rows[0];

    logger.info(`User data retrieved for user: ${user}`);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserData,
};
