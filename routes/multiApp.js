/*--- these routes can be used by any frontend that wants to use this api ---*/

const express = require("express");
const router = express.Router();
const appCtrl = require("../controllers/multiApp/multiApp");
const multerImgCtrl = require("../controllers/multer");

router.get("/allapps/data", appCtrl.showAllMultiAppData);
router.get("/allapps/data/:app", appCtrl.getSpecificAppData);
router.get("/allapps/data/:app/:userId", appCtrl.getSpecificAppUserData);

// This route will create user data and their first image but if a user already exists and tries to hit this route, this route will essentially behave like the below post route and just add the picture to the users existing data
router.post(
  "/allapps",
  multerImgCtrl.uploadImage.single("image"),
  appCtrl.createData
);

// this route allows for a user to add additional pictures to their data
router.post(
  "/allapps/data/:app/:userId",
  multerImgCtrl.uploadImage.single("image"),
  appCtrl.addToUsersPicData
);

// this route deletes a user's data and all of their images
router.delete("/allapps/data/:app/:userId", appCtrl.deleteUserAndPicData);

// this route allows for a user to delete their own pic data
router.delete("/allapps/data/:app/:userId/:picId", appCtrl.deleteUserPicData);

module.exports = router;
