const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

router.post('/sensor', sensorController.insertSensor);
router.get('/sensor', sensorController.getAllSensor);
router.get('/sensor/latest', sensorController.getLatestSensor);

module.exports = router;
