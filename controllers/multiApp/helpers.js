const MultiApp = require("../../models/multiFrontend");
const cloudinary = require("../../config/cloudinaryConfig");
const Console = require("Console");
const get = require("lodash/get");
const map = require("lodash/map");

module.exports = { createNewUserFromData, getUser, getApp };

// ------- functions with no routes associated to them but used by ctrls ------- //
async function getUser(req, res, usersInfo) {
  let application =
    req.params.app || req.body.application || usersInfo.application;
  let userID = req.params.userId || req.body.userID || usersInfo.userID;

  const user = await MultiApp.find({
    application,
    userID,
  });

  return user;
}

async function getApp(req, res) {
  return await MultiApp.find({
    application: req.params.app,
  });
}

// this allows a user to create data w/1 or more images
async function createNewUserFromData(req, res) {
  Console.debug(
    "** User in createData(req) is not in the DB, so one is being created ** "
  );

  try {
    const { userID, application } = req.body;
    const pics = req.files;
    const appData = new MultiApp({
      userID,
      application,
    });

    await appData.save();
    // ==== after it saves the user, it adds the pictures to the user data
    const user = await MultiApp.find(appData);

    map(pics, async (eachPic) => {
      const cloudPic = await cloudinary.uploader.upload(eachPic.path);

      const picture = {
        image: cloudPic.secure_url || "",
        cloudinaryID: cloudPic.public_id || "",
      };

      // adding the pictures to the users picture array
      user[0].picture.push(picture);
      await user[0].save();
    });
    res.status(200).json({ user });
  } catch (err) {
    Console.error("err: ", err);
    res.status(400).json(err);
  }
}
