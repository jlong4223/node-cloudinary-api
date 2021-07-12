/*--- these routes can be used by any frontend that wants to use this api ---*/

const express = require("express");
const router = express.Router();
const multerImgCtrl = require("../../controllers/multer");
const controllers = require("../../controllers/multiApp/multiApp");
const routeParams = require("./constants").multiAppRoutes;

// ------------------------- destructuring controller methods ------------------------- //
const {
  showAllMultiAppData,
  getSpecificAppData,
  getSpecificAppUserData,
  createData,
  addMultiplePicsToUser,
  deleteUserAndPicData,
  deleteUserPicData,
} = controllers;

// ------------------------- destructuring route params ------------------------- //
const { allApps, app, appUser, userPic } = routeParams;

// ------------------------- assigning middleware ------------------- //
const multerUploadMiddleware = multerImgCtrl.uploadImage.array("image", 5);

// ================================================================================== //
// -------------------------- MultiApp Routes -------------------------- //
router.get(allApps, showAllMultiAppData);
router.get(app, getSpecificAppData);
router.get(appUser, getSpecificAppUserData);

// ======= creates user data and first image(s) or saves pics to a found user from the request
router.post(allApps, multerUploadMiddleware, createData);

// ======= allows a user to add one or multiple pictures to their data
router.post(appUser, multerUploadMiddleware, addMultiplePicsToUser);

// ======= deletes a user's data and all of their images
router.delete(appUser, deleteUserAndPicData);

// ======= deletes a user's image sent in the request
router.delete(userPic, deleteUserPicData);

module.exports = router;
