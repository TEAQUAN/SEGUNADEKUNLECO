const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        console.log("❌ No Authorization header found");
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    console.log("🔹 Authorization Header:", authHeader);

    // Extract token (handling both "Bearer <TOKEN>" and plain "<TOKEN>")
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    if (!token) {
        console.log("❌ Invalid Token Format");
        return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = verified; // Attach admin info to request
        console.log("✅ Token is valid:", verified);
        next();
    } catch (error) {
        console.log("❌ Invalid Token Error:", error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};
