const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const logger = require("morgan");

// importing routes
const landingRoute = require("./routes/welcome");
const imageRoute = require("./routes/multer");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

// using imported routes
app.use("/", landingRoute);
app.use("/", imageRoute);

app.listen(port, () =>
  console.log(`👂🏻 === Server is listening on port ${port}! === 👂🏻`)
);
