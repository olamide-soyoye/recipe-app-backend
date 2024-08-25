const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); 

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'bmp','webp','heif'], 
  },
});

const upload = multer({ storage });

module.exports = upload;