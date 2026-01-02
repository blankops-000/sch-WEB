const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/about');
const auth = require('../middleware/auth');

// Public routes
router.get('/', aboutController.getAboutInfo);

// Admin routes
router.put('/', auth(['admin']), aboutController.updateAboutInfo);

module.exports = router;