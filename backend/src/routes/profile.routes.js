// src/routes/profile.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');

// Get user profile by ID (public, but requires authentication)
router.get('/:userId', authenticate, profileController.getUserProfile);

// Update profiles (own profile only)
router.put('/student', authenticate, profileController.updateStudentProfile);
router.put('/alumni', authenticate, profileController.updateAlumniProfile);

module.exports = router;