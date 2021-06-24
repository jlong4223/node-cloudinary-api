const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const multerImgCtrl = require("../controllers/multer");

router.get("/users", userCtrl.getUsers);
// TODO have a delete and put route with cloudinary
router.post(
  "/signup",
  multerImgCtrl.uploadImage.single("image"),
  userCtrl.signup
);

module.exports = router;
