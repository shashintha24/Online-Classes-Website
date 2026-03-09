const buildHealthPayload = async () => {
  return {
    status: "ok",
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  };
};

module.exports = { buildHealthPayload };
