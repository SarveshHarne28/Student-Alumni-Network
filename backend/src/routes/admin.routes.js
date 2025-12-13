// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, requireRole } = require('../middleware/auth.middleware');

// admin-only routes
router.get('/pending-users', authenticate, requireRole('admin'), adminController.getPendingUsers);
router.post('/verify/:userId', authenticate, requireRole('admin'), adminController.verifyUser);
router.post('/revoke/:userId', authenticate, requireRole('admin'), adminController.revokeUser);

module.exports = router;
