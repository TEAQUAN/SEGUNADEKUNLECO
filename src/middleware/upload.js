const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("../config/cloudinary");

// Log Cloudinary configuration
console.log('Cloudinary Config:', {
    cloud_name: cloudinary.config().cloud_name,
    api_key: cloudinary.config().api_key,
});

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'properties',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        resource_type: 'auto',
        transformation: [{ width: 1000, crop: 'limit' }]
    }
});

const upload = multer({ storage });

module.exports = upload;
