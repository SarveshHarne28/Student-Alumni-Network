const express = require("express");
const router = express.Router();
const connectionController = require("../controllers/connection.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Connection routes
router.post("/send", authenticate, connectionController.sendRequest);
router.post("/respond", authenticate, connectionController.respondRequest);
router.get("/", authenticate, connectionController.getConnections);
router.get("/pending", authenticate, connectionController.getPendingRequests);

module.exports = router;
