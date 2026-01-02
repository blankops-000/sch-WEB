const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policy');
const auth = require('../middleware/auth');

// Public routes
router.get('/', policyController.getAllPolicies);
router.get('/:id', policyController.getPolicyById);

// Admin routes
router.post('/', auth(['admin']), policyController.createPolicy);

module.exports = router;