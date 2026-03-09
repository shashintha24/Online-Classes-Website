const app = require("./app");
const { env } = require("./config/env");
const { testDbConnection } = require("./config/db");

const PORT = env.PORT || 5000;

const startServer = async () => {
  await testDbConnection();

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
};

startServer();
