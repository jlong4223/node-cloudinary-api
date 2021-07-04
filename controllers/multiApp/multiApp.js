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

// TODO delete a specific picture without deleting a user

// *** delete a entire/specific user and all their picture data
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

module.exports = {
  createData,
  showAllMultiAppData,
  getSpecificAppData,
  getSpecificAppUserData,
  addToUsersPicData,
  deleteUserAndPicData,
};
