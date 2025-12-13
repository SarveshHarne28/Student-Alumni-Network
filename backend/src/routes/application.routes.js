// src/routes/application.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const applicationController = require('../controllers/application.controller');

// Get all applications for an opportunity (alumni)
router.get('/opportunity/:opportunity_id', authenticate, applicationController.getApplicationsForOpportunity);

// Update application status (alumni)
router.put('/:application_id/status', authenticate, applicationController.updateApplicationStatus);

// ========== NEW ROUTES ==========

// Get accepted students for an opportunity
router.get('/opportunity/:opportunity_id/accepted', authenticate, applicationController.getAcceptedStudents);

// Send email to accepted students
router.post('/opportunity/:opportunity_id/notify-accepted', authenticate, applicationController.notifyAcceptedStudents);

module.exports = router;