const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const CLOUD_USERNAME = process.env.CLOUD_USERNAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

cloudinary.config({
    cloud_name: CLOUD_USERNAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

module.exports = cloudinary;
