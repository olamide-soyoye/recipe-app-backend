const multer = require('multer');

// Image upload setup
exports.upload = multer({ dest: 'images/' });
