const { Pool } = require("pg");
const { env } = require("./env");

const dbConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
};

const pool = new Pool(dbConfig);

const testDbConnection = async () => {
  if (!dbConfig.password) {
    console.warn("Database password is empty. Skipping DB connection test.");
    return;
  }

  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");
  } catch (error) {
    console.warn("Database connection failed. Server will continue to run.");
    console.warn(error.message);
  }
};

module.exports = {
  pool,
  testDbConnection,
};
