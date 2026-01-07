const express = require('express');
const router = express.Router();
const controller = require('../controllers/sensorController');
const { isAdmin } = require('../middleware/authMiddleware');

router.post('/sensor', controller.insertSensor);
router.get('/sensor', isAdmin, controller.getAllSensor);
router.get('/sensor/latest', controller.getLatestSensor);

module.exports = router;
