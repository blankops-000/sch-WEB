const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Validation middleware
const eventValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('startDate', 'Start date is required').not().isEmpty()
];

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/range', eventController.getEventsByDateRange);
router.get('/:id', eventController.getEventById);

// Admin routes
router.post('/', auth(['admin']), eventValidation, eventController.createEvent);
router.put('/:id', auth(['admin']), eventController.updateEvent);
router.delete('/:id', auth(['admin']), eventController.deleteEvent);

module.exports = router;