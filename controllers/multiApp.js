/*------ This api is used by multiple frontend applications -----*/

const cloudinary = require("../config/cloudinaryConfig");
const MultiApp = require("../models/multiFrontend");
const Console = require("Console");
const get = require("lodash/get");

async function createData(req, res) {
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

// showing all data which is a combo of applications using this api
async function showAllMultiAppData(req, res) {
  const data = await MultiApp.find({});
  res.json(data);
}

// grabbing user data by the req.params.id, which is the userID sent from frontend and not the mongodb id
async function getOneMultiAppUser(req, res) {
  try {
    const data = await MultiApp.find({ userID: req.params.userId });
    res.json(data);
  } catch (err) {
    console.log("err: ", err);
  }
}

module.exports = { createData, getOneMultiAppUser, showAllMultiAppData };
