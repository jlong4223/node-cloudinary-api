const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const picModelSchema = require("./picModel").schema;

const appSchema = new Schema({
  userID: String,
  application: String,
  picture: [picModelSchema],
});

module.exports = mongoose.model("MultiFrontend", appSchema);
