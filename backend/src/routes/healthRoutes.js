const express = require('express');
const router = express.Router();
const { getDbType } = require('../config/db');

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'CareConnect Hospital Appointment System API',
    version: '1.0.0',
    database: getDbType(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
