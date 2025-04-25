const { pool } = require("pg");

const pool = new pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
