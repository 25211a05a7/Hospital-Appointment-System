const { query } = require('../config/db');

/**
 * Helper to get patient ID for user
 */
async function resolvePatientId(user, explicitPatientId) {
  if (user.role === 'patient') {
    const patients = await query('SELECT id FROM patients WHERE user_id = ?', [user.id]);
    if (!patients || patients.length === 0) {
      // Create patient record if not present
      const res = await query('INSERT INTO patients (user_id) VALUES (?)', [user.id]);
      return res.insertId;
    }
    return patients[0].id;
  }
  if (explicitPatientId) {
    return explicitPatientId;
  }
  return null;
}

/**
 * Helper to get doctor ID for user
 */
async function resolveDoctorId(user) {
  if (user.role === 'doctor') {
    const docs = await query('SELECT id FROM doctors WHERE user_id = ? OR email = ?', [user.id, user.email]);
    if (docs && docs.length > 0) {
      return docs[0].id;
    }
  }
  return null;
}

/**
 * Create an appointment
 * Validations:
 * - Date must not be in the past
 * - Doctor must exist and be active
 * - Patient must exist
 * - Doctor must not already have a booking for that date + time slot
 */
const createAppointment = async (req, res, next) => {
  try {
    const { doctor_id, appointment_date, appointment_time, reason, patient_id } = req.body;
    const user = req.user;

    // Validate inputs
    if (!doctor_id || !appointment_date || !appointment_time || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Doctor, appointment date, appointment time, and reason for visit are required.'
      });
    }

    // Resolve patient ID
    const targetPatientId = await resolvePatientId(user, patient_id);
    if (!targetPatientId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient profile. Please ensure you are logged in as a patient.'
      });
    }

    // 1. Prevent past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(appointment_date);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule appointments for dates in the past. Please select today or a future date.'
      });
    }

    // 2. Check doctor exists and is active
    const doctors = await query('SELECT * FROM doctors WHERE id = ?', [doctor_id]);
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'The selected doctor does not exist.'
      });
    }
    const doctor = doctors[0];
    if (!doctor.is_active) {
      return res.status(400).json({
        success: false,
        message: 'This doctor is currently unavailable for bookings. Please choose another doctor.'
      });
    }

    // 3. Prevent duplicate doctor/time booking (availability enforcement)
    const existingBookings = await query(
      `SELECT id, status FROM appointments 
       WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'Cancelled'`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (existingBookings && existingBookings.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Dr. ${doctor.name} already has a confirmed booking for ${appointment_date} at ${appointment_time}. Please pick another time slot.`
      });
    }

    // 4. Save to Database
    const insertResult = await query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
       VALUES (?, ?, ?, ?, ?, 'Confirmed')`,
      [targetPatientId, doctor_id, appointment_date, appointment_time, reason.trim()]
    );

    // Fetch full created appointment details
    const apptDetails = await query(
      `SELECT 
        a.*,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization,
        d.consultation_fee,
        d.profile_image AS doctor_image,
        u.name AS patient_name,
        u.email AS patient_email,
        u.phone AS patient_phone
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN patients p ON a.patient_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE a.id = ?`,
      [insertResult.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      appointment: apptDetails[0]
    });
  } catch (error) {
    if (
      error.code === 'ER_DUP_ENTRY' ||
      error.code === 'ERR_SQLITE_ERROR' ||
      (error.message && error.message.includes('UNIQUE constraint failed'))
    ) {
      return res.status(409).json({
        success: false,
        message: 'This doctor is already booked for the selected date and time slot. Please choose another time.'
      });
    }
    next(error);
  }
};

/**
 * Get all appointments (Admin or filtered)
 */
const getAllAppointments = async (req, res, next) => {
  try {
    const { status, doctor_id, date, search } = req.query;

    let sql = `
      SELECT 
        a.id,
        a.patient_id,
        a.doctor_id,
        a.appointment_date,
        a.appointment_time,
        a.reason,
        a.status,
        a.created_at,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization,
        d.consultation_fee,
        d.profile_image AS doctor_image,
        u.name AS patient_name,
        u.email AS patient_email,
        u.phone AS patient_phone,
        p.gender AS patient_gender,
        p.blood_group AS patient_blood_group
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role === 'doctor') {
      const docId = await resolveDoctorId(req.user);
      if (!docId) {
        return res.status(200).json({ success: true, count: 0, appointments: [] });
      }
      sql += ' AND a.doctor_id = ?';
      params.push(docId);
    } else if (req.user.role === 'patient') {
      const patId = await resolvePatientId(req.user);
      sql += ' AND a.patient_id = ?';
      params.push(patId);
    }

    if (status && status !== 'all') {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    if (doctor_id && doctor_id !== 'all') {
      sql += ' AND a.doctor_id = ?';
      params.push(doctor_id);
    }

    if (date) {
      sql += ' AND a.appointment_date = ?';
      params.push(date);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (u.name LIKE ? OR d.name LIKE ? OR a.reason LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    sql += ' ORDER BY a.appointment_date DESC, a.appointment_time ASC';

    const appointments = await query(sql, params);

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get appointments for logged in user (patient or doctor)
 */
const getMyAppointments = async (req, res, next) => {
  try {
    const user = req.user;
    let sql = `
      SELECT 
        a.id,
        a.patient_id,
        a.doctor_id,
        a.appointment_date,
        a.appointment_time,
        a.reason,
        a.status,
        a.created_at,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization,
        d.consultation_fee,
        d.profile_image AS doctor_image,
        u.name AS patient_name,
        u.email AS patient_email,
        u.phone AS patient_phone,
        p.gender AS patient_gender,
        p.blood_group AS patient_blood_group,
        p.date_of_birth AS patient_dob
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
    `;
    const params = [];

    if (user.role === 'patient') {
      const patientId = await resolvePatientId(user);
      sql += ' WHERE a.patient_id = ?';
      params.push(patientId);
    } else if (user.role === 'doctor') {
      const doctorId = await resolveDoctorId(user);
      sql += ' WHERE a.doctor_id = ?';
      params.push(doctorId || -1);
    } else {
      // Admin gets all
      sql += ' WHERE 1=1';
    }

    sql += ' ORDER BY a.appointment_date DESC, a.appointment_time ASC';

    const appointments = await query(sql, params);

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single appointment by ID
 */
const getAppointmentById = async (req, res, next) => {
  try {
    const apptId = req.params.id;
    const user = req.user;

    const sql = `
      SELECT 
        a.*,
        d.name AS doctor_name,
        d.email AS doctor_email,
        d.specialization AS doctor_specialization,
        d.qualification AS doctor_qualification,
        d.consultation_fee,
        d.profile_image AS doctor_image,
        d.available_timings AS doctor_timings,
        u.name AS patient_name,
        u.email AS patient_email,
        u.phone AS patient_phone,
        p.gender AS patient_gender,
        p.date_of_birth AS patient_dob,
        p.blood_group AS patient_blood_group,
        p.address AS patient_address,
        p.emergency_contact AS patient_emergency_contact
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.id = ?
    `;

    const appointments = await query(sql, [apptId]);

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }

    const appt = appointments[0];

    // Authorization checks
    if (user.role === 'patient') {
      const patientId = await resolvePatientId(user);
      if (appt.patient_id !== patientId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only view your own appointments.'
        });
      }
    } else if (user.role === 'doctor') {
      const doctorId = await resolveDoctorId(user);
      if (appt.doctor_id !== doctorId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only view appointments assigned to you.'
        });
      }
    }

    return res.status(200).json({
      success: true,
      appointment: appt
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update appointment status (Admin or Doctor)
 * Statuses: Pending, Confirmed, Cancelled, Completed
 */
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const apptId = req.params.id;
    const { status } = req.body;
    const user = req.user;

    const validStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values are: ${validStatuses.join(', ')}`
      });
    }

    // Verify appointment exists
    const appts = await query('SELECT * FROM appointments WHERE id = ?', [apptId]);
    if (!appts || appts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }
    const appt = appts[0];

    // Check doctor authorization
    if (user.role === 'doctor') {
      const doctorId = await resolveDoctorId(user);
      if (appt.doctor_id !== doctorId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Doctors can only manage their own assigned appointments.'
        });
      }
    }

    await query('UPDATE appointments SET status = ? WHERE id = ?', [status, apptId]);

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to '${status}'.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel appointment (Patient, Doctor, or Admin)
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const apptId = req.params.id;
    const user = req.user;

    const appts = await query('SELECT * FROM appointments WHERE id = ?', [apptId]);
    if (!appts || appts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.'
      });
    }
    const appt = appts[0];

    if (user.role === 'patient') {
      const patientId = await resolvePatientId(user);
      if (appt.patient_id !== patientId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only cancel your own appointments.'
        });
      }
    } else if (user.role === 'doctor') {
      const doctorId = await resolveDoctorId(user);
      if (appt.doctor_id !== doctorId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only cancel appointments assigned to you.'
        });
      }
    }

    await query('UPDATE appointments SET status = ? WHERE id = ?', ['Cancelled', apptId]);

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment
};
