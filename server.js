const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const logger = require("morgan");

const Console = require("Console");
const map = require("lodash/map");

/* ----- requiring configurations ---- */
require("dotenv").config();
require("./config/cloudinaryConfig");
require("./config/dbConfig");

/* ------ importing routes ------ */
const landingRoute = require("./routes/welcome");
const imageRoute = require("./routes/multer");
const cloudImgRoute = require("./routes/cloudinary");
const userRoutes = require("./routes/user");
const allRoutes = [landingRoute, imageRoute, cloudImgRoute, userRoutes];

/* ------ middleware ------ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

/* ----- using imported routes ----- */
app.use(
  "/",
  map(allRoutes, (eachRoute) => eachRoute)
);

app.listen(port, () =>
  Console.success(` 😎 === Server is listening on port ${port}! === 🥳`)
);
