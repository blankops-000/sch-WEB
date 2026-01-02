const express = require('express');
const router = express.Router();
const contactController = require('../controllers/Contact');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Validation middleware
const contactValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('subject', 'Subject is required').not().isEmpty(),
  check('message', 'Message is required').not().isEmpty()
];

// Public routes
router.post('/', contactValidation, contactController.sendContactMessage);

// Admin routes
router.get('/', auth(['admin']), contactController.getAllMessages);
router.get('/:id', auth(['admin']), contactController.getMessageById);
router.post('/:id/reply', auth(['admin']), contactController.replyToMessage);
router.delete('/:id', auth(['admin']), contactController.deleteMessage);

module.exports = router;