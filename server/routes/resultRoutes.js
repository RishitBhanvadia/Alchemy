const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

router.get('/:chem_a/:chem_b/:chem_c/:chem_d', resultController.calculateResult);

module.exports = router;
