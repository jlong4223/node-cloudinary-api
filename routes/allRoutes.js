/* ------ importing routes ------ */
const landingRoute = require("./welcome");
const imageRoute = require("./multer");
const cloudImgRoute = require("./cloudinary");
const userRoutes = require("./user");
const multiAppRoutes = require("./multiApp");

const allRoutes = [
  landingRoute,
  imageRoute,
  cloudImgRoute,
  userRoutes,
  multiAppRoutes,
];

module.exports = allRoutes;
