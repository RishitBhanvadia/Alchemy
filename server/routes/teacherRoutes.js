const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.get('/analytics', teacherController.getAnalytics);

module.exports = router;
