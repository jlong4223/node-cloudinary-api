/*------ This api is used by multiple frontend applications -----*/

const cloudinary = require("../config/cloudinaryConfig");
const MultiApp = require("../models/multiFrontend");
const notFound = require("./shared/notFound");
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

/* == showing all data which is a combo of applications using this api == */
async function showAllMultiAppData(req, res) {
  const data = await MultiApp.find({});
  res.json(data);
}

/* == narrows down data shown based on app param == */
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

/* === allows for the search of a specific user within searched app === */
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

module.exports = {
  createData,
  showAllMultiAppData,
  getSpecificAppData,
  getSpecificAppUserData,
};
