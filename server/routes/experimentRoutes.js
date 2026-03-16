const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experimentController');
const { validate } = require('../middleware/validate');

router.post('/log', validate('logExperiment'), experimentController.logExperiment);
router.get('/history', experimentController.getHistory);

module.exports = router;
