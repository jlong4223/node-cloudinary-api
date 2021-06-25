/*--- these routes can be used by any frontend that wants to use this api ---*/

const express = require("express");
const router = express.Router();
const appCtrl = require("../controllers/multiApp");
const multerImgCtrl = require("../controllers/multer");

router.get("/allapps/data", appCtrl.showAllMultiAppData);
router.get("/allapps/data/:app", appCtrl.getSpecificAppData);
router.get("/allapps/data/:app/:userId", appCtrl.getSpecificAppUserData);

router.post(
  "/allapps",
  multerImgCtrl.uploadImage.single("image"),
  appCtrl.createData
);

module.exports = router;
