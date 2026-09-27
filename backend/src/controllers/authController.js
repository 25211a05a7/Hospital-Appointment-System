const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Register a new patient
 * Validates: full name, email, 10-digit phone, password min 6 chars, password match, duplicate email
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword, dateOfBirth, gender, address } = req.body;

    // 1. Validate required fields
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, password, and confirm password are required fields.'
      });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // 3. Validate 10-digit phone number
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be at least 10 digits.'
      });
    }

    // 4. Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // 5. Match password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirmation password do not match.'
      });
    }

    // 6. Check for duplicate email
    const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please login instead.'
      });
    }

    // 7. Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 8. Insert into users table
    const userResult = await query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, 'patient', cleanPhone]
    );

    const userId = userResult.insertId;

    // 9. Insert into patients table
    const patientResult = await query(
      'INSERT INTO patients (user_id, date_of_birth, gender, address) VALUES (?, ?, ?, ?)',
      [userId, dateOfBirth || null, gender || 'Male', address || null]
    );

    const patientId = patientResult.insertId;

    // 10. Generate JWT token
    const token = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), role: 'patient', name: name.trim() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to CareConnect Hospital.',
      token,
      user: {
        id: userId,
        patient_id: patientId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: 'patient',
        phone: cleanPhone,
        date_of_birth: dateOfBirth || null,
        gender: gender || 'Male',
        address: address || null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Login
 * Authenticates email and password against MySQL database
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Find user by email
    const users = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.'
      });
    }

    const user = users[0];

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.'
      });
    }

    // Fetch related profile details based on role
    let profileData = {};
    if (user.role === 'patient') {
      const patients = await query('SELECT * FROM patients WHERE user_id = ?', [user.id]);
      if (patients && patients.length > 0) {
        profileData = patients[0];
      }
    } else if (user.role === 'doctor') {
      const doctors = await query('SELECT * FROM doctors WHERE user_id = ? OR email = ?', [user.id, user.email]);
      if (doctors && doctors.length > 0) {
        profileData = doctors[0];
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        patient_id: profileData.id && user.role === 'patient' ? profileData.id : undefined,
        doctor_id: profileData.id && user.role === 'doctor' ? profileData.id : undefined,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile: profileData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get authenticated user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const users = await query('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?', [userId]);

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const user = users[0];
    let roleDetails = null;

    if (user.role === 'patient') {
      const patients = await query('SELECT * FROM patients WHERE user_id = ?', [userId]);
      roleDetails = patients[0] || null;
    } else if (user.role === 'doctor') {
      const doctors = await query('SELECT * FROM doctors WHERE user_id = ? OR email = ?', [userId, user.email]);
      roleDetails = doctors[0] || null;
    }

    return res.status(200).json({
      success: true,
      user: {
        ...user,
        details: roleDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update authenticated user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone, dateOfBirth, gender, address, bloodGroup, emergencyContact } = req.body;

    if (name || phone) {
      await query(
        'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?',
        [name || null, phone || null, userId]
      );
    }

    if (req.user.role === 'patient') {
      await query(
        `UPDATE patients SET 
          date_of_birth = COALESCE(?, date_of_birth),
          gender = COALESCE(?, gender),
          address = COALESCE(?, address),
          blood_group = COALESCE(?, blood_group),
          emergency_contact = COALESCE(?, emergency_contact)
         WHERE user_id = ?`,
        [dateOfBirth || null, gender || null, address || null, bloodGroup || null, emergencyContact || null, userId]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
