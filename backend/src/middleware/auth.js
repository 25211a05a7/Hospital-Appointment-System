const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'careconnect_super_secret_jwt_key_2026_nrd_lab_b9';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.'
      });
    }

    // Fetch latest user details
    const users = await query('SELECT id, name, email, role, phone FROM users WHERE id = ?', [decoded.id]);
    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.'
      });
    }

    const user = users[0];
    
    // Attach role-specific ID if patient or doctor
    if (user.role === 'patient') {
      const patients = await query('SELECT id FROM patients WHERE user_id = ?', [user.id]);
      if (patients && patients.length > 0) {
        user.patient_id = patients[0].id;
      }
    } else if (user.role === 'doctor') {
      const doctors = await query('SELECT id FROM doctors WHERE user_id = ? OR email = ?', [user.id, user.email]);
      if (doctors && doctors.length > 0) {
        user.doctor_id = doctors[0].id;
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

module.exports = {
  authenticate,
  JWT_SECRET
};
