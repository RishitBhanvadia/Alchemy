const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const { validate } = require('../middleware/validate');

router.post('/create', validate('createClassroom'), classroomController.createClassroom);
router.post('/join', validate('joinClassroom'), classroomController.joinClassroom);

module.exports = router;
