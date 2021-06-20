const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 6;

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: String,
    // BUG figure out how to allow a user to signup without submitting a picture being required
    picture: String,
  },
  {
    timestamps: true,
  }
);

/* ------ Removing password when user data sent as json ----- */
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

/* ------ hash and salting password before saving ------ */
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  // password has been changed - salt and hash it
  bcrypt.hash(user.password, SALT_ROUNDS, function (err, hash) {
    if (err) return next(err);
    // replace the user provided password with the hash
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", userSchema);
