const multer = require("multer");
const path = require("path");

// this function is for assigning the storage location and file name when it is saved
const imgStorageLoc = multer.diskStorage({
  // Destination to store image; this is the images dir
  destination: "images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

// this function is for providing size limits and restrictions to file types: .png & .jpg
const uploadImage = multer({
  storage: imgStorageLoc,
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

module.exports = { uploadImage };
