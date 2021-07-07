const express = require("express");
const router = express.Router();
const imgCtrl = require("../controllers/multer");

// using .single to limit the upload to one picture
// route saves the images directly to this servers image file
router.post(
  "/upload",
  // image in quotes has to match the key name that is sending the file
  imgCtrl.uploadImage.single("image"),
  (req, res) => {
    res.send(req.file);
  },
  (err, req, res, next) => {
    res.status(400).send({ err: err.message });
  }
);

// route that allows multiple (4) images to be uploaded
router.post(
  "/uploadmany",
  imgCtrl.uploadImage.array("image", 4),
  (req, res) => {
    res.send(req.files);
  },
  (err, req, res, next) => {
    res.status(400).send({ err: err.message });
  }
);

module.exports = router;
