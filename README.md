# Node.js, Cloudinary & Multer Image-upload API

This API was created for the purpose of learning how to use multer with cloudinary to upload and save images. A user can securely sign up and include a profile picture.

This API is also set up to be used by multiple frontends as long as the frontend dev adheres to the `multiFrontend` mongoose model when they send a form here. This allows various unrelated frontends to add a picture upload feature for users that are already signed up with a different API.

## Tech Used:

- Node.js
- Express.js
- Multer
- Morgan
- Postman
- Cloudinary
- MongoDB & Mongoose
- lodash
- bcrypt

## Future Enhancments:

- delete and put controllers/routes for removal of data from mongodb and cloudinary
- add testing with mocha & chai
- add husky for pre-commit hooks
