const express = require("express");
const router = express.Router();

const imgCtrl = require("../controllers/multer");

// using .single to limit the upload to one picture
router.post(
  "/upload",
  imgCtrl.uploadImage.single("image"),
  (req, res) => {
    res.send(req.file);
  },
  (err, req, res, next) => {
    res.status(400).send({ err: err.message });
  }
);

module.exports = router;
