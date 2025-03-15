const express = require('express');
const propertyController = require('../controllers/Property');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const router = express.Router();

// Public Routes
router.get('/', propertyController.getProperties);
router.get('/filter', propertyController.filterProperties);
router.get('/:id', propertyController.getPropertyById);

// Admin-Only Routes
router.post('/', authMiddleware, upload.array('images', 10), propertyController.createProperty);
router.put('/:id', authMiddleware, propertyController.updateProperty);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);

module.exports = router;
