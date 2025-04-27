const crypto = require("crypto");

const generateResetToken = () => {
  /**
   * crypto.randomBytes(32) - generates 32 random bytes of data (which is very secure and unpredictable)
   * .toString("hex") - converts the random bytes to a hexadecimal string
   *  @result you get a long random string that is very hard to guess
   *  @why you need a unique and secure token that no attacker could guess
   * crypto.createHash("sha256") creates a SHA-256 hash object.
   * A sha256 hash is a one-way cryptographic function that takes an input and produces a fixed-size string of characters, which is typically a hexadecimal number.
   * This is used to ensure that the token is stored securely in the database.
   * update(resetToken) passes the raw token into the hash function.
   * digest("hex") produces the final hashed string in hex format.
   */
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  /**
   * Reset token - the raw token you send to the user's email.
   * Hashed token - the secured token you store in your database.
   * When the user clicks the link in the email, the token is sent back to the server.
   */
  return { resetToken, hashedToken };
};

module.exports = generateResetToken;
