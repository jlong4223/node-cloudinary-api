/*------ This api is used by multiple frontend applications -----*/
const MultiApp = require("../../models/multiFrontend");
const addToUsersPicData = require("./helpers").addToUsersPicData;
const createNewUserFromData = require("./helpers").createNewUserFromData;
const notFound = require("../shared/notFound");
const Console = require("Console");
const map = require("lodash/map");
const cloudinary = require("../../config/cloudinaryConfig");

/* 
This function will first search for an exisiting user and if there is one, 
it will call the function that posts to the users existing picture array; 
if there is not a user it will go to the default case and 
create a new user and save their first picture
*/
async function createData(req, res) {
  // looking for any user data in the request
  let { userID, application } = req.body;

  const user = await MultiApp.find({
    application,
    userID,
  });

  Console.debug("-> The createData() req user is in the database: ", !!user[0]);

  switch (true) {
    // if there is user data, calls function that adds pic to their data
    case user && user.length === 1:
      const usersInfo = {
        userID: user[0].userID,
        application: user[0].application,
      };

      addToUsersPicData(req, res, usersInfo);
      break;

    // if there is not user data, creates new user and saves first picture
    default:
      createNewUserFromData(req, res);
  }
}

/* ========= showing all data which is a combo of applications using this api ======== */
async function showAllMultiAppData(req, res) {
  const data = await MultiApp.find({});
  res.json(data);
}

/* ========= narrows down data shown based on app param ========= */
async function getSpecificAppData(req, res) {
  try {
    const appData = await MultiApp.find({
      application: req.params.app,
    });

    appData.length > 0 ? res.json(appData) : res.json(notFound);
  } catch (err) {
    console.log("error", err);
  }
}

/* ========= allows for the search of a specific user within searched app ========= */
async function getSpecificAppUserData(req, res) {
  try {
    const appData = await MultiApp.find({
      application: req.params.app,
      userID: req.params.userId,
    });

    appData.length > 0 ? res.json(appData) : res.json(notFound);
  } catch (err) {
    console.log("error", err);
  }
}

/* ===================== deletes specific pic data saved to a user =================== */
async function deleteUserPicData(req, res) {
  try {
    await MultiApp.updateOne(
      {
        application: req.params.app,
        userID: req.params.userId,
      },
      // using mongoDB $pull to remove image obj
      // from the picture array, which is deleting the
      // image that has a cloudinaryID that matches the picId param
      { $pull: { picture: { cloudinaryID: req.params.picId } } },
      { upsert: true, new: true, runValidators: true }
    );

    // removing the image from cloudinary
    await cloudinary.uploader.destroy(req.params.picId);

    res.json({
      deleted: {
        status: "success",
        application: req.params.app,
        userID: req.params.userId,
        cloudinaryPicId: req.params.picId,
      },
    });
  } catch (e) {
    console.log("error: ", e);
  }
}

// *** delete a entire/specific user and all their picture data ==================
async function deleteUserAndPicData(req, res) {
  try {
    const user = await MultiApp.find({
      application: req.params.app,
      userID: req.params.userId,
    });

    // deleting each picture in that the user has saved in cloudinary
    map(user[0].picture, (eachPic) =>
      cloudinary.uploader.destroy(eachPic.cloudinaryID)
    );

    // then deleting the user from mongodb
    await MultiApp.findByIdAndDelete(user[0]._id);
    res.json({ user });
  } catch (err) {
    console.log("err: ", err);
  }
}

// TODO use this in place of the current addToUsersPicData() helper
// this should be the function for users to add pics to their array; this one works for one or more pics being uploaded
async function addMultiplePicsToUser(req, res, usersInfo) {
  try {
    const user = await MultiApp.find({
      application: req.params.app,
      userID: req.params.userId,
    });
    const pics = req.files;

    map(pics, async (eachPic) => {
      const cloudPic = await cloudinary.uploader.upload(eachPic.path);

      const picture = {
        image: cloudPic.secure_url,
        cloudinaryID: cloudPic.public_id,
      };

      // adding the pictures to the users picture array
      user[0].picture.push(picture);
      user[0].save();
    });

    res.status(200).json({ user });
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json({ err });
  }
}

module.exports = {
  createData,
  showAllMultiAppData,
  getSpecificAppData,
  getSpecificAppUserData,
  addToUsersPicData,
  addMultiplePicsToUser,
  deleteUserAndPicData,
  deleteUserPicData,
};
