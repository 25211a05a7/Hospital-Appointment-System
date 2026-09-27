const { query } = require('../config/db');

/**
 * Get all patients (Admin only)
 */
const getAllPatients = async (req, res, next) => {
  try {
    const { search } = req.query;

    let sql = `
      SELECT 
        p.id,
        p.user_id,
        p.date_of_birth,
        p.gender,
        p.address,
        p.blood_group,
        p.emergency_contact,
        p.created_at,
        u.name,
        u.email,
        u.phone,
        COUNT(a.id) AS total_appointments
      FROM patients p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN appointments a ON p.id = a.patient_id
      WHERE 1=1
    `;
    const params = [];

    if (search && search.trim() !== '') {
      sql += ' AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    sql += ' GROUP BY p.id, p.user_id, u.name, u.email, u.phone ORDER BY u.name ASC';

    const patients = await query(sql, params);

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get patient details by ID
 */
const getPatientById = async (req, res, next) => {
  try {
    const patientId = req.params.id;

    const sql = `
      SELECT 
        p.*,
        u.name,
        u.email,
        u.phone
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `;

    const patients = await query(sql, [patientId]);
    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }

    // Also get patient appointment history
    const history = await query(
      `SELECT a.*, d.name AS doctor_name, d.specialization
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.patient_id = ?
       ORDER BY a.appointment_date DESC`,
      [patientId]
    );

    return res.status(200).json({
      success: true,
      patient: {
        ...patients[0],
        appointments: history
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPatients,
  getPatientById
};
