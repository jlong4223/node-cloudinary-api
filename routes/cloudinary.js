const express = require("express");
const router = express.Router();
const multerImgCtrl = require("../controllers/multer");
const cloudinary = require("../config/cloudinaryConfig");

// TODO send back a response and assign the req.file to the user id in the future
// bringing in the multer controller and allowing for the upload of a single image
router.post(
  "/cloud",
  multerImgCtrl.uploadImage.single("image"),
  async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log("result: ", result);
    } catch (err) {
      console.log("error: ", err);
    }
  }
);

module.exports = router;
