const MultiApp = require("../../models/multiFrontend");
const cloudinary = require("../../config/cloudinaryConfig");
const Console = require("Console");
const get = require("lodash/get");
const map = require("lodash/map");

module.exports = { createNewUserFromData, addToUsersPicData };

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

// TODO no longer using this function; only allows one initial pic upload
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
