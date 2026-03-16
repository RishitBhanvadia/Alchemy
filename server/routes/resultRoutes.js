const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { validate } = require('../middleware/validate');

router.post('/', validate('reaction'), resultController.calculateResult);

module.exports = router;
