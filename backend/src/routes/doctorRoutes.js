const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// Public doctor endpoints
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);

// Admin-only doctor management endpoints
router.post('/', authenticate, authorize(['admin']), doctorController.createDoctor);
router.put('/:id', authenticate, authorize(['admin']), doctorController.updateDoctor);
router.delete('/:id', authenticate, authorize(['admin']), doctorController.deleteDoctor);

module.exports = router;
