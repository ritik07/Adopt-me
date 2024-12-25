const express = require("express");
const app = express();
const cors = require("cors");
const appRoutes = require("./app/routes/routes");
const fileUploadRoutes = require("./app/helper/fileUpload");
const { PORT } = require("./app/connections/config");
const responseFormatter = require("./app/middleware/responseFormatter");
require("./app/connections/database");

require("dotenv").config();

app.use(express.static("file"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this line to parse form data

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(responseFormatter);
app.use(express.json());

app.use("/api", appRoutes);
app.use("/api", fileUploadRoutes);

// Handle unknown routes
app.use("/", (req, res) => {
  res.send("404 no route found");
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Now listening on port ` + PORT);
});
