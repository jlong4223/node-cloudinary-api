const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const picSchema = require("./picModel");

const picSchema = new Schema(
  {
    image: String,
    cloudinaryID: String,
  },
  {
    timestamps: true,
  }
);

const appSchema = new Schema({
  userID: String,
  application: String,
  picture: [picSchema],
});

module.exports = mongoose.model("MultiFrontend", appSchema);
