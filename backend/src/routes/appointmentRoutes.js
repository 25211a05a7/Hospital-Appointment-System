const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// All appointment routes require authentication
router.use(authenticate);

// Book appointment (Patient or Admin)
router.post('/', appointmentController.createAppointment);

// List appointments (Admin gets all, Doctor gets assigned, Patient gets own)
router.get('/', appointmentController.getAllAppointments);
router.get('/my', appointmentController.getMyAppointments);
router.get('/:id', appointmentController.getAppointmentById);

// Update status (Admin or Doctor)
router.patch('/:id/status', authorize(['admin', 'doctor']), appointmentController.updateAppointmentStatus);

// Cancel appointment (Patient, Doctor, Admin)
router.patch('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;
