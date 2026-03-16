const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { validate } = require('../middleware/validate');

router.post('/explain', aiController.aiRateLimiter, validate('aiExplain'), aiController.explainReaction);
router.get('/hint', aiController.hintRateLimiter, aiController.getHint);

module.exports = router;

