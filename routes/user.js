const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const multerImgCtrl = require("../controllers/multer");

router.get("/users", userCtrl.getUsers);

router.post(
  "/signup",
  multerImgCtrl.uploadImage.single("image"),
  userCtrl.signup
);

module.exports = router;
