const express = require('express');
const router = express.Router();
const titrationController = require('../controllers/titrationController');

router.get('/', titrationController.getTitrationData);

module.exports = router;
