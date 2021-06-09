const express = require("express");
const router = express.Router();

const welcomeCtrl = require("../controllers/welcome");

router.get("/", welcomeCtrl.welcome);

module.exports = router;
