// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// Search and browse users
router.get('/search', authenticate, userController.searchUsers);
router.get('/', authenticate, userController.getAllUsers);

module.exports = router;