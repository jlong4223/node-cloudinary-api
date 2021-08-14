const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const picSchema = new Schema(
  {
    image: String,
    cloudinaryID: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pic", picSchema);
