// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// register student / alumni
router.post('/register/student', authController.registerStudent);
router.post('/register/alumni', authController.registerAlumni);

// login
router.post('/login', authController.login);

// profile (protected)
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
