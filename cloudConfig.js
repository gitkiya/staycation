require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

console.log('CloudinaryStorage:', CloudinaryStorage);
console.log('Type:', typeof CloudinaryStorage);


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary : cloudinary,
  params: {
    folder: 'staycation_Dev',
    allowed_formats: ['jpeg', 'png', 'jpg']
    // supports promises as well
  }
}); 

module.exports = { cloudinary, storage };


