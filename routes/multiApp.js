/*--- these routes can be used by any frontend that wants to use this api ---*/

const express = require("express");
const router = express.Router();
const appCtrl = require("../controllers/multiApp/multiApp");
const multerImgCtrl = require("../controllers/multer");

router.get("/allapps", appCtrl.showAllMultiAppData);
router.get("/allapps/:app", appCtrl.getSpecificAppData);
router.get("/allapps/:app/:userId", appCtrl.getSpecificAppUserData);

// This route will create user data and their first image but if a user already exists and tries to hit this route, this route will essentially behave like the below post route and just add the picture to the users existing data
router.post(
  "/allapps",
  multerImgCtrl.uploadImage.single("image"),
  appCtrl.createData
);

// TODO remove this appCtrl function and replace it with addMultiplePicsToUser()
// this route allows for a user to add additional pictures to their data
// router.post(
//   "/allapps/:app/:userId",
//   multerImgCtrl.uploadImage.single("image"),
//   appCtrl.addToUsersPicData
// );

// this route allows a user to add multiple pictures to their data
router.post(
  "/allapps/:app/:userId",
  multerImgCtrl.uploadImage.array("image", 5),
  appCtrl.addMultiplePicsToUser
);

// this route deletes a user's data and all of their images
router.delete("/allapps/:app/:userId", appCtrl.deleteUserAndPicData);

// this route allows for a user to delete their own pic data
router.delete("/allapps/:app/:userId/:picId", appCtrl.deleteUserPicData);

module.exports = router;
