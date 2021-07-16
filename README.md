# Node.js, Cloudinary & Multer Image-upload API

This API was created for the purpose of learning how to use multer with cloudinary to upload and save images. A user can also securely sign up here and include a profile picture.

This API is also set up to be used by multiple frontends. The correct form data key-value pairs are listed below. This allows various unrelated frontends to add a picture upload feature for users that are already signed up with a different API. A user can upload up to 5 images at a time.

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

## Form-Data & Route for frontend:

Route: '/allapps'

```
{
    image: File(s),
    userID: String,
    application: String
}
```

- the userID is the user's ID that comes from authenticating in this API or a different API
- the application is the name of the application that the user posting from

## Future Enhancments:

- add testing with mocha & chai
- add husky for pre-commit hooks
