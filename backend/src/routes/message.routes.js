const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Message routes
router.post("/send", authenticate, messageController.sendMessage);
router.get("/:with_user_id", authenticate, messageController.getMessages);

// NEW: Read status routes (make sure these are added)
router.post("/mark-read", authenticate, messageController.markAsRead);
router.get("/unread/count", authenticate, messageController.getUnreadCount);

module.exports = router;