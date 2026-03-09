const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Online Classes API is running",
		health: "/api/health",
	});
});

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
