// src/routes/opportunity.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const opportunityController = require('../controllers/opportunity.controller');

// create
router.post('/', authenticate, opportunityController.createOpportunity);

// my postings
router.get('/my-postings', authenticate, opportunityController.getMyPostings);

// update
router.put('/:id', authenticate, opportunityController.updateOpportunity);



module.exports = router;
