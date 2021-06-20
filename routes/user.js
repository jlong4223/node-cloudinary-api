const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const multerImgCtrl = require("../controllers/multer");

router.post(
  "/signup",
  multerImgCtrl.uploadImage.single("image"),
  userCtrl.signup
);

module.exports = router;
