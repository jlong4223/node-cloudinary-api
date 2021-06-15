require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const Console = require("Console");

const verifyCloudinaryConnection = (async () => {
  try {
    await cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    (() => {
      switch (true) {
        case cloudinary.config().api_key !== null &&
          cloudinary.config().cloud_name !== null &&
          cloudinary.config().api_secret !== null:
          return Console.success(
            `⚡️ ⚡️ ⚡️ CloudinaryConnectionStatus: 200, connected to: ${
              cloudinary.config().cloud_name
            } ⚡️ ⚡️ ⚡️`
          );
        default:
          return Console.warning("Something is wrong with cloudinary configs");
      }
    })();
  } catch (err) {
    Console.error(`🚧 == Cloudinary config error: ${err} == 🚧 `);
  }
})();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

(module.exports = cloudinary), { verifyCloudinaryConnection };
