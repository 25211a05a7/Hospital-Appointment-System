const { query } = require('../config/db');

/**
 * Get all doctors with optional search and filter
 */
const getAllDoctors = async (req, res, next) => {
  try {
    const { search, department, specialization, active } = req.query;

    let sql = `
      SELECT 
        d.id,
        d.user_id,
        d.department_id,
        d.name,
        d.email,
        d.specialization,
        d.qualification,
        d.experience,
        d.consultation_fee,
        d.available_days,
        d.available_timings,
        d.profile_image,
        d.description,
        d.is_active,
        dept.name AS department_name
      FROM doctors d
      LEFT JOIN departments dept ON d.department_id = dept.id
      WHERE 1=1
    `;
    const params = [];

    // Filter active doctors (default to all or filtered by query)
    if (active !== undefined && active !== '') {
      sql += ' AND d.is_active = ?';
      params.push(active === 'true' || active === '1' ? 1 : 0);
    }

    // Filter by department
    if (department && department !== 'all') {
      sql += ' AND (dept.name = ? OR d.department_id = ?)';
      params.push(department, department);
    }

    // Filter by specialization
    if (specialization && specialization !== 'all') {
      sql += ' AND d.specialization = ?';
      params.push(specialization);
    }

    // Search query (doctor name, qualification, specialization)
    if (search && search.trim() !== '') {
      sql += ' AND (d.name LIKE ? OR d.specialization LIKE ? OR d.qualification LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY d.name ASC';

    const doctors = await query(sql, params);

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor by ID
 */
const getDoctorById = async (req, res, next) => {
  try {
    const doctorId = req.params.id;

    const sql = `
      SELECT 
        d.*,
        dept.name AS department_name,
        dept.icon AS department_icon
      FROM doctors d
      LEFT JOIN departments dept ON d.department_id = dept.id
      WHERE d.id = ?
    `;

    const doctors = await query(sql, [doctorId]);

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${doctorId} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      doctor: doctors[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new doctor (Admin only)
 */
const createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      department_id,
      specialization,
      qualification,
      experience,
      consultation_fee,
      available_days,
      available_timings,
      profile_image,
      description,
      is_active
    } = req.body;

    if (!name || !email || !specialization || !qualification) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, specialization, and qualification are required.'
      });
    }

    // Check existing doctor email
    const existing = await query('SELECT id FROM doctors WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A doctor with this email already exists.'
      });
    }

    const defaultImg = profile_image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400';

    const result = await query(
      `INSERT INTO doctors 
        (department_id, name, email, specialization, qualification, experience, consultation_fee, available_days, available_timings, profile_image, description, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        department_id || 1,
        name.trim(),
        email.toLowerCase().trim(),
        specialization.trim(),
        qualification.trim(),
        parseInt(experience || '1', 10),
        parseFloat(consultation_fee || '500.00'),
        available_days || 'Monday - Saturday',
        available_timings || '09:00 AM - 05:00 PM',
        defaultImg,
        description || '',
        is_active !== undefined ? (is_active ? 1 : 0) : 1
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Doctor created successfully!',
      doctor_id: result.insertId
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update doctor (Admin only)
 */
const updateDoctor = async (req, res, next) => {
  try {
    const doctorId = req.params.id;
    const {
      name,
      department_id,
      specialization,
      qualification,
      experience,
      consultation_fee,
      available_days,
      available_timings,
      profile_image,
      description,
      is_active
    } = req.body;

    const existing = await query('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      });
    }

    await query(
      `UPDATE doctors SET
        name = COALESCE(?, name),
        department_id = COALESCE(?, department_id),
        specialization = COALESCE(?, specialization),
        qualification = COALESCE(?, qualification),
        experience = COALESCE(?, experience),
        consultation_fee = COALESCE(?, consultation_fee),
        available_days = COALESCE(?, available_days),
        available_timings = COALESCE(?, available_timings),
        profile_image = COALESCE(?, profile_image),
        description = COALESCE(?, description),
        is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        name || null,
        department_id || null,
        specialization || null,
        qualification || null,
        experience !== undefined ? parseInt(experience, 10) : null,
        consultation_fee !== undefined ? parseFloat(consultation_fee) : null,
        available_days || null,
        available_timings || null,
        profile_image || null,
        description !== undefined ? description : null,
        is_active !== undefined ? (is_active ? 1 : 0) : null,
        doctorId
      ]
    );

    return res.status(200).json({
      success: true,
      message: 'Doctor details updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete or Deactivate doctor (Admin only)
 */
const deleteDoctor = async (req, res, next) => {
  try {
    const doctorId = req.params.id;
    const { hardDelete } = req.query;

    const existing = await query('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      });
    }

    if (hardDelete === 'true') {
      await query('DELETE FROM doctors WHERE id = ?', [doctorId]);
      return res.status(200).json({
        success: true,
        message: 'Doctor record deleted permanently.'
      });
    } else {
      // Soft toggle deactivate
      await query('UPDATE doctors SET is_active = 0 WHERE id = ?', [doctorId]);
      return res.status(200).json({
        success: true,
        message: 'Doctor deactivated successfully.'
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};
