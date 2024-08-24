const express = require('express');
const router = express.Router();
const imageController = require('../Controllers/imageController');
const uploadUtils = require('../utils/uploadUtils');

// Route for uploading images
router.post('/', uploadUtils.upload.single('image'), imageController.uploadImage);

module.exports = router;
