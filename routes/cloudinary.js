const express = require("express");
const router = express.Router();
const multerImgCtrl = require("../controllers/multer");
const cloudinaryCtrl = require("../controllers/cloudinary");

/* 
- bringing in the multer controller as middleware and allowing for the upload of a single image
- multer is the middleware changing the file name, providing restrictions on size and type
- the image multer provides is then sent to cloudinary 
*/
router.post(
  "/cloud",
  multerImgCtrl.uploadImage.single("image"),
  cloudinaryCtrl.picUpload
);

module.exports = router;
