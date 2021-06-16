require("dotenv").config();
const cloudinary = require("../config/cloudinaryConfig");
const Console = require("Console");

module.exports = { picUpload };

async function picUpload(req, res) {
  try {
    // Uploading image to cloudinary - this is ran after the multer middleware on the route
    const result = await cloudinary.uploader.upload(req.file.path);
    Console.log("result: ", result);
    res.send({ uploadStatus: 200, url: result.url });
  } catch (err) {
    Console.error("error: ", err);
  }
}
