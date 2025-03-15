const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary'); // Ensure Cloudinary is configured

console.log("✅ Multer is initializing...");

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'properties', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed file types
    },
});

const upload = multer({ storage });

console.log("✅ Multer storage configured with Cloudinary");

module.exports = upload;
