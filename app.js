const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const dotenv = require('dotenv');
const propertyRoutes = require('./src/routes/propertyRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const contactRoutes = require('./src/routes/contact');
require('./src/utils/cloudinary'); // ✅ Load Cloudinary config
require('dotenv').config();
dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // ✅ Handles raw JSON
app.use(express.urlencoded({ extended: true })); // ✅ Handles form-data (important!)

console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)

app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', contactRoutes);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("Connected to port at", port);
});

module.exports = app;
