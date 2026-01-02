const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academic');
const auth = require('../middleware/auth');

// Public routes
router.get('/', academicController.getAllPrograms);
router.get('/grade/:level', academicController.getProgramByGrade);
router.get('/subjects', academicController.getAllSubjects);

// Admin routes (if needed in future)
// router.post('/', auth(['admin']), academicController.createProgram);

module.exports = router;