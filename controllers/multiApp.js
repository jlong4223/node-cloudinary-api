/*------ This api is used by multiple frontend applications -----*/

const cloudinary = require("../config/cloudinaryConfig");
const MultiApp = require("../models/multiFrontend");
const notFound = require("./shared/notFound");
const Console = require("Console");
const get = require("lodash/get");

/* 
This function will first search for an exisiting user and if there is one, it will call the function that posts to the users existing picture array; if there is not a user it will go to the default case and create a new user and save their first picture
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
      const users = {
        userID: user[0].userID,
        application: user[0].application,
      };
      addToUsersPicData(req, res, users);
      break;

    // if there is not user data, creates new user and saves first picture
    default:
      Console.debug(
        "** User in createData(req) is not in the DB, so one is being created ** "
      );

      try {
        const cloudImg =
          get(req.file, "path") !== undefined &&
          (await cloudinary.uploader.upload(req.file.path));

        let { userID, application } = req.body;
        let picture = {
          image: cloudImg.secure_url || "",
          cloudinaryID: cloudImg.public_id || "",
        };

        const appData = new MultiApp({
          userID,
          application,
          picture,
        });

        await appData.save();
        res.json({ appData });
      } catch (err) {
        Console.error("err: ", err);
        res.status(400).json(err);
      }
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

/* --------- allowing a user to post/save more pictures to their pictures array -------- */
async function addToUsersPicData(req, res, users) {
  try {
    Console.debug(">>> the req user from users param is: ", users.userID);

    /* this function either takes route params or 
    user data that is forwarded through this functions users param
    from the createData switch/case to find user information
    */
    const user = await MultiApp.find(
      {
        application: req.params.app || users.application,
        userID: req.params.userId || users.userID,
      },
      async () => {
        let newPic =
          get(req.file, "path") !== undefined &&
          (await cloudinary.uploader.upload(req.file.path));

        let picture = {
          image: newPic.secure_url || "",
          cloudinaryID: newPic.public_id || "",
        };

        user[0].picture.push(picture);
        user[0].save();

        res.json(user[0]);
      }
    );
  } catch (err) {
    console.log("error in adding to users pic: ", err);
  }
}

module.exports = {
  createData,
  showAllMultiAppData,
  getSpecificAppData,
  getSpecificAppUserData,
  addToUsersPicData,
};
