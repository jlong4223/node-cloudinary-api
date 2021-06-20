const jwt = require("jsonwebtoken");
const Console = require("Console");
const User = require("../models/user");
const SECRET = process.env.SECRET;
const cloudinary = require("../config/cloudinaryConfig");

// TODO send back user with signed JWT

async function signup(req, res) {
  try {
    /* ----- uploading image to cloudinary; this happens after multer ----- */
    const cloudImg = await cloudinary.uploader.upload(req.file.path);

    /* ----- assigning picture object to cloudinary data ----- */
    let { name, email, password } = req.body;
    let picture = {
      image: cloudImg.secure_url,
      cloudinaryID: cloudImg.public_id,
    };

    /* ---- saving the user using schema and assigned variables above ---- */
    const user = new User({
      name,
      email,
      password,
      picture,
    });

    await user.save();
    res.json({ user });
  } catch (err) {
    Console.error("err: ", err);
    res.status(400).json(err);
  }
}

module.exports = { signup };
