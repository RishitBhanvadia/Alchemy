const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// All AI routes are protected by the AI-specific rate limiter
router.post('/explain', aiController.aiRateLimiter, aiController.explainReaction);
router.get('/hint', aiController.hintRateLimiter, aiController.getHint);


module.exports = router;

