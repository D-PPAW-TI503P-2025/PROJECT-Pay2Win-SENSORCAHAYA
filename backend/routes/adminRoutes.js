const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/authMiddleware');

// Semua route hanya bisa diakses admin
router.get('/users', isAdmin, adminController.getAllUsers);
router.post('/users', isAdmin, adminController.createUser);
router.put('/users/:id', isAdmin, adminController.updateUser);
router.delete('/users/:id', isAdmin, adminController.deleteUser);

module.exports = router;
