// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
const dotenv = require("dotenv")
dotenv.config({path:"./config/.env"})
cloudinary.config({
  cloud_name: process.env.API_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SEC
});

module.exports = cloudinary;