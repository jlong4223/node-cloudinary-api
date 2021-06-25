const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const logger = require("morgan");
const cors = require("cors");

const Console = require("Console");
const map = require("lodash/map");

/* ---- requiring routes ---- */
const allRoutes = require("./routes/allRoutes");

/* ----- requiring configurations ---- */
require("dotenv").config();
require("./config/cloudinaryConfig");
require("./config/dbConfig");

/* ------ middleware ------ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cors());

/* ----- using imported routes ----- */
app.use(
  "/",
  map(allRoutes, (eachRoute) => eachRoute)
);

app.listen(port, () =>
  Console.success(` 😎 === Server is listening on port ${port}! === 🥳`)
);
