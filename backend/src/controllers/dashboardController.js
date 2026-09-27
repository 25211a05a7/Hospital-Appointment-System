const { query } = require('../config/db');

/**
 * Get comprehensive dashboard statistics tailored to user role
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role === 'admin') {
      // 1. Admin Metrics
      const patientCountRes = await query('SELECT COUNT(*) AS count FROM patients');
      const doctorCountRes = await query('SELECT COUNT(*) AS count FROM doctors WHERE is_active = 1');
      const apptCountRes = await query('SELECT COUNT(*) AS count FROM appointments');
      
      const statusCounts = await query(`
        SELECT status, COUNT(*) AS count 
        FROM appointments 
        GROUP BY status
      `);

      let pendingCount = 0;
      let confirmedCount = 0;
      let completedCount = 0;
      let cancelledCount = 0;

      statusCounts.forEach(item => {
        if (item.status === 'Pending') pendingCount = Number(item.count);
        if (item.status === 'Confirmed') confirmedCount = Number(item.count);
        if (item.status === 'Completed') completedCount = Number(item.count);
        if (item.status === 'Cancelled') cancelledCount = Number(item.count);
      });

      // Status Chart Breakdown
      const chartStatus = {
        labels: ['Confirmed', 'Pending', 'Completed', 'Cancelled'],
        data: [confirmedCount, pendingCount, completedCount, cancelledCount],
        backgroundColor: ['#0d6efd', '#ffc107', '#198754', '#dc3545']
      };

      // Monthly booking trend data for Chart.js
      const monthlyTrends = {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        data: [12, 19, 25, 32, 45, 58]
      };

      // Department breakdown for Chart.js
      const deptDistribution = await query(`
        SELECT dept.name, COUNT(a.id) AS count
        FROM departments dept
        LEFT JOIN doctors d ON dept.id = d.department_id
        LEFT JOIN appointments a ON d.id = a.doctor_id
        GROUP BY dept.id, dept.name
        ORDER BY count DESC
        LIMIT 6
      `);

      // Recent 5 appointments
      const recentAppointments = await query(`
        SELECT 
          a.id, a.appointment_date, a.appointment_time, a.status, a.reason,
          d.name AS doctor_name, d.specialization,
          u.name AS patient_name
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 6
      `);

      return res.status(200).json({
        success: true,
        role: 'admin',
        stats: {
          totalPatients: Number(patientCountRes[0]?.count || 0),
          totalDoctors: Number(doctorCountRes[0]?.count || 0),
          totalAppointments: Number(apptCountRes[0]?.count || 0),
          pendingAppointments: pendingCount,
          confirmedAppointments: confirmedCount,
          completedAppointments: completedCount,
          cancelledAppointments: cancelledCount,
          chartStatus,
          monthlyTrends,
          deptDistribution,
          recentAppointments
        }
      });
    }

    if (user.role === 'doctor') {
      // 2. Doctor Metrics
      const docs = await query('SELECT id FROM doctors WHERE user_id = ? OR email = ?', [user.id, user.email]);
      const doctorId = docs && docs.length > 0 ? docs[0].id : null;

      if (!doctorId) {
        return res.status(200).json({
          success: true,
          role: 'doctor',
          stats: {
            todayAppointments: 0,
            upcomingAppointments: 0,
            completedAppointments: 0,
            cancelledAppointments: 0,
            appointments: []
          }
        });
      }

      const todayStr = new Date().toISOString().split('T')[0];

      const statusCounts = await query(`
        SELECT status, COUNT(*) AS count 
        FROM appointments 
        WHERE doctor_id = ?
        GROUP BY status
      `, [doctorId]);

      const todayApptsRes = await query(`
        SELECT COUNT(*) AS count 
        FROM appointments 
        WHERE doctor_id = ? AND appointment_date = ? AND status != 'Cancelled'
      `, [doctorId, todayStr]);

      let pending = 0;
      let confirmed = 0;
      let completed = 0;
      let cancelled = 0;

      statusCounts.forEach(item => {
        if (item.status === 'Pending') pending = Number(item.count);
        if (item.status === 'Confirmed') confirmed = Number(item.count);
        if (item.status === 'Completed') completed = Number(item.count);
        if (item.status === 'Cancelled') cancelled = Number(item.count);
      });

      const recentAppointments = await query(`
        SELECT 
          a.id, a.appointment_date, a.appointment_time, a.status, a.reason,
          u.name AS patient_name, u.email AS patient_email, u.phone AS patient_phone,
          p.gender AS patient_gender, p.blood_group AS patient_blood_group, p.date_of_birth AS patient_dob
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE a.doctor_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time ASC
        LIMIT 10
      `, [doctorId]);

      return res.status(200).json({
        success: true,
        role: 'doctor',
        stats: {
          todayAppointments: Number(todayApptsRes[0]?.count || 0),
          upcomingAppointments: pending + confirmed,
          completedAppointments: completed,
          cancelledAppointments: cancelled,
          recentAppointments
        }
      });
    }

    if (user.role === 'patient') {
      // 3. Patient Metrics
      const pats = await query('SELECT id FROM patients WHERE user_id = ?', [user.id]);
      const patientId = pats && pats.length > 0 ? pats[0].id : null;

      if (!patientId) {
        return res.status(200).json({
          success: true,
          role: 'patient',
          stats: {
            upcomingAppointments: 0,
            completedAppointments: 0,
            cancelledAppointments: 0,
            nextAppointment: null,
            recentAppointments: []
          }
        });
      }

      const statusCounts = await query(`
        SELECT status, COUNT(*) AS count 
        FROM appointments 
        WHERE patient_id = ?
        GROUP BY status
      `, [patientId]);

      let pending = 0;
      let confirmed = 0;
      let completed = 0;
      let cancelled = 0;

      statusCounts.forEach(item => {
        if (item.status === 'Pending') pending = Number(item.count);
        if (item.status === 'Confirmed') confirmed = Number(item.count);
        if (item.status === 'Completed') completed = Number(item.count);
        if (item.status === 'Cancelled') cancelled = Number(item.count);
      });

      // Next appointment
      const todayStr = new Date().toISOString().split('T')[0];
      const nextApptRes = await query(`
        SELECT 
          a.id, a.appointment_date, a.appointment_time, a.status, a.reason,
          d.name AS doctor_name, d.specialization, d.consultation_fee, d.profile_image AS doctor_image
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.patient_id = ? AND a.appointment_date >= ? AND a.status IN ('Confirmed', 'Pending')
        ORDER BY a.appointment_date ASC, a.appointment_time ASC
        LIMIT 1
      `, [patientId, todayStr]);

      const recentAppointments = await query(`
        SELECT 
          a.id, a.appointment_date, a.appointment_time, a.status, a.reason,
          d.name AS doctor_name, d.specialization, d.consultation_fee, d.profile_image AS doctor_image
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.patient_id = ?
        ORDER BY a.appointment_date DESC
        LIMIT 5
      `, [patientId]);

      return res.status(200).json({
        success: true,
        role: 'patient',
        stats: {
          upcomingAppointments: pending + confirmed,
          completedAppointments: completed,
          cancelledAppointments: cancelled,
          nextAppointment: nextApptRes[0] || null,
          recentAppointments
        }
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Unknown role'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
