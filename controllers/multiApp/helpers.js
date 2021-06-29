const MultiApp = require("../../models/multiFrontend");
const cloudinary = require("../../config/cloudinaryConfig");
const Console = require("Console");
const get = require("lodash/get");

module.exports = { createNewUserFromData, addToUsersPicData };

async function createNewUserFromData(req, res) {
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

/* --------- allowing a user to post/save more pictures to their pictures array -------- */
async function addToUsersPicData(req, res, usersInfo) {
  try {
    Console.debug(
      `>>> the req user from users param is ${usersInfo.userID} from ${usersInfo.application}`
    );

    /* this function either takes route params or 
      user data that is forwarded through this functions usersInfo param
      from the createData switch/case to find user information
    */
    const user = await MultiApp.find(
      {
        application: req.params.app || usersInfo.application,
        userID: req.params.userId || usersInfo.userID,
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
