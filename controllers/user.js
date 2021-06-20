const jwt = require("jsonwebtoken");
const Console = require("Console");
const User = require("../models/user");
const SECRET = process.env.SECRET;
const cloudinary = require("../config/cloudinaryConfig");

// TODO sent back user with signed JWT

async function signup(req, res) {
  try {
    const cloudImg = await cloudinary.uploader.upload(req.file.path);
    Console.log("img: ", cloudImg.url);

    let { name, email, password } = req.body;
    let picture = cloudImg.url;

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
