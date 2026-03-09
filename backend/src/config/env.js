const dotenv = require("dotenv");

dotenv.config();

const toStringOrDefault = (value, fallback = "") => {
  if (value === undefined || value === null) {
    return fallback;
  }

  return typeof value === "string" ? value : String(value);
};

const env = {
  NODE_ENV: toStringOrDefault(process.env.NODE_ENV, "development"),
  PORT: Number(process.env.PORT || 5000),
  DB_HOST: toStringOrDefault(process.env.DB_HOST, "localhost"),
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_USER: toStringOrDefault(process.env.DB_USER, "postgres"),
  DB_PASSWORD: toStringOrDefault(process.env.DB_PASSWORD, ""),
  DB_NAME: toStringOrDefault(process.env.DB_NAME, "online_classes"),
};

module.exports = { env };
