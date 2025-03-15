const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Debugging: Check if env variables are loaded
console.log("✅ CLOUDINARY CONFIG:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "❌ NOT SET");
console.log("API Key:", process.env.CLOUDINARY_API_KEY || "❌ NOT SET");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ NOT SET");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
