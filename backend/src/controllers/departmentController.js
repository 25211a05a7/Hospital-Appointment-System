const { query } = require('../config/db');

/**
 * Get all departments with doctor counts
 */
const getAllDepartments = async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        dept.*,
        COUNT(d.id) as doctor_count
      FROM departments dept
      LEFT JOIN doctors d ON dept.id = d.department_id AND d.is_active = 1
      GROUP BY dept.id
      ORDER BY dept.name ASC
    `;

    const departments = await query(sql);

    return res.status(200).json({
      success: true,
      count: departments.length,
      departments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDepartments
};
