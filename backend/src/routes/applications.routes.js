// src/routes/applications.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const applicationsController = require('../controllers/applications.controller');

// get all opportunities (students view)
router.get('/opportunities', authenticate, applicationsController.getAllOpportunities);

// apply to opportunity (students only)
router.post('/', authenticate, applicationsController.applyToOpportunity);


// NEW: student's own applications
router.get('/my-applications', authenticate, applicationsController.getMyApplications);

module.exports = router;
