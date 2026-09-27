const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.use(authenticate);

// Admin-only patient list
router.get('/', authorize(['admin']), patientController.getAllPatients);
// Admin or Doctor can view specific patient details
router.get('/:id', authorize(['admin', 'doctor']), patientController.getPatientById);

module.exports = router;
