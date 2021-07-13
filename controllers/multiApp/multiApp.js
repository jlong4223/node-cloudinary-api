/*------ This api is used by multiple frontend applications -----*/
const MultiApp = require("../../models/multiFrontend");
const notFound = require("../shared/notFound");
const Console = require("Console");
const map = require("lodash/map");
const cloudinary = require("../../config/cloudinaryConfig");

/* ------ helpers ------ */
const { createNewUserFromData, getApp, getUser } = require("./helpers");

/* 
This function will first search for an exisiting user and if there is one, 
it will call the function that posts to the users existing picture array; 
if there is not a user it will go to the default case and 
create a new user and save their first picture
*/
async function createData(req, res) {
  // looking for any user data in the request
  const user = await getUser(req, res);

  Console.debug("-> The createData() req user is in the database: ", !!user[0]);

  switch (true) {
    // if there is user data, calls function that adds pic to their data
    case user && user.length === 1:
      const usersInfo = {
        userID: user[0].userID,
        application: user[0].application,
      };

      addMultiplePicsToUser(req, res, usersInfo);
      break;

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
    const appData = await getApp(req, res);

    appData.length > 0 ? res.json(appData) : res.status(404).json(notFound);
  } catch (err) {
    console.log("error", err);
  }
}

/* ========= allows for the search of a specific user within searched app ========= */
async function getSpecificAppUserData(req, res) {
  try {
    const appData = await getUser(req, res);

    appData.length > 0 ? res.json(appData) : res.status(404).json(notFound);
  } catch (err) {
    console.log("error", err);
  }
}

/* ===================== deletes specific pic data saved to a user =================== */
async function deleteUserPicData(req, res) {
  try {
    // const user = await getUser(req, res);
    const picId = req.params.picId;

    // BUG figure out why this saves the pic to a diff obj in mongo when deleted
    // await MultiApp.updateOne(
    //   user,
    //   { $pull: { picture: { cloudinaryID: picId } } },
    //   { strict: false, upsert: true, new: true, runValidators: true }
    // );

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
    await cloudinary.uploader.destroy(picId);

    res.json({
      deleted: {
        status: "success",
        application: req.params.app,
        userID: req.params.userId,
        cloudinaryPicId: picId,
      },
    });
  } catch (e) {
    console.log("error: ", e);
  }
}

// *** delete a entire/specific user and all their picture data ==================
async function deleteUserAndPicData(req, res) {
  try {
    const user = await getUser(req, res);

    // no user found, sends back 404
    !user[0] && res.status(404).json(notFound);

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

// function for users to add pics to their array; this one works for one or more pics being uploaded
async function addMultiplePicsToUser(req, res, usersInfo) {
  try {
    Console.debug(
      `>>> the req user from users param is ${
        usersInfo.userID || req.params.userId
      } from ${usersInfo.application || req.params.app}`
    );

    const user = await getUser(req, res, usersInfo);
    const pics = req.files;

    map(pics, async (eachPic) => {
      const cloudPic = await cloudinary.uploader.upload(eachPic.path);

      const picture = {
        image: cloudPic.secure_url || "",
        cloudinaryID: cloudPic.public_id || "",
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
  addMultiplePicsToUser,
  deleteUserAndPicData,
  deleteUserPicData,
};
