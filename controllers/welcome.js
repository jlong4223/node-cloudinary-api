exports.welcome = (req, res) => {
  res.json({
    message: "Welcome to the Multer image upload api",
    createdBy: "Jared Long",
    purpose: "This API is for uploading images",
  });
};
