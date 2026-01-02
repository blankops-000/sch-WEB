const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation middleware
const newsValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('content', 'Content is required').not().isEmpty(),
  check('category', 'Please select a valid category').isIn([
    'general', 'academic', 'sports', 'achievement', 'event', 'announcement'
  ])
];

// Public routes
router.get('/', newsController.getAllNews);
router.get('/latest', newsController.getLatestNews);
router.get('/:id', newsController.getNewsById);

// Admin routes
router.post(
  '/',
  auth(['admin']),
  upload.single('featuredImage'),
  newsValidation,
  newsController.createNews
);

router.put(
  '/:id',
  auth(['admin']),
  upload.single('featuredImage'),
  newsController.updateNews
);

router.delete('/:id', auth(['admin']), newsController.deleteNews);

module.exports = router;