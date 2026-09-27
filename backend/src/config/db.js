const mysql = require('mysql2/promise');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let pool = null;
let sqliteDb = null;
let dbType = 'mysql';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'hospital_appointment';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);

async function initDatabase() {
  // If explicitly forced or MySQL fails, fallback to SQLite
  if (process.env.USE_SQLITE === 'true') {
    initSqlite();
    return;
  }

  try {
    // Attempt connecting to MySQL with a short timeout
    const testConnection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
      connectTimeout: 3000
    });

    await testConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await testConnection.end();

    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true
    });

    // Test pool connection
    const conn = await pool.getConnection();
    conn.release();
    dbType = 'mysql';
    console.log(`[DB] Connected successfully to MySQL database '${DB_NAME}' on ${DB_HOST}:${DB_PORT}`);
  } catch (err) {
    console.warn(`[DB] Notice: MySQL server connection unavailable (${err.message}).`);
    console.log('[DB] Activating built-in high-performance local SQLite database engine for zero-config execution...');
    initSqlite();
  }
}

function initSqlite() {
  dbType = 'sqlite';
  const dbDir = path.join(__dirname, '../../../database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'hospital_appointment.sqlite');
  sqliteDb = new DatabaseSync(dbPath);

  // Initialize Schema and Seed if empty
  setupSqliteSchemaAndSeed(sqliteDb);
  console.log(`[DB] Connected to SQLite database at: ${dbPath}`);
}

function setupSqliteSchemaAndSeed(db) {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      icon TEXT DEFAULT 'bi-heart-pulse',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'patient',
      phone TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      date_of_birth TEXT,
      gender TEXT DEFAULT 'Male',
      address TEXT,
      blood_group TEXT,
      emergency_contact TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NULL,
      department_id INTEGER NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      specialization TEXT NOT NULL,
      qualification TEXT NOT NULL,
      experience INTEGER NOT NULL DEFAULT 1,
      consultation_fee REAL NOT NULL DEFAULT 500.00,
      available_days TEXT NOT NULL DEFAULT 'Monday - Saturday',
      available_timings TEXT NOT NULL DEFAULT '09:00 AM - 05:00 PM',
      profile_image TEXT DEFAULT 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
      description TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
      UNIQUE(doctor_id, appointment_date, appointment_time)
    );
  `);

  // Check if users exist; if not, seed data
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('[DB] Populating initial seed data into database...');

    // Seed departments
    const insertDept = db.prepare('INSERT OR IGNORE INTO departments (id, name, description, icon) VALUES (?, ?, ?, ?)');
    insertDept.run(1, 'General Medicine', 'Comprehensive primary healthcare, diagnostics, and chronic disease management for all ages.', 'bi-capsule');
    insertDept.run(2, 'Cardiology', 'Advanced cardiac diagnostics, heart health screening, ECG, Echo, and cardiovascular treatments.', 'bi-heart-pulse-fill');
    insertDept.run(3, 'Dermatology', 'Expert skin, hair, and nail care, clinical dermatology, and aesthetic medical procedures.', 'bi-sun-fill');
    insertDept.run(4, 'Pediatrics', 'Dedicated medical care, neonatal care, child development, and vaccinations for infants and children.', 'bi-emoji-smile-fill');
    insertDept.run(5, 'Orthopedics', 'Bone, joint, spinal health, sports injuries, fracture management, and joint replacements.', 'bi-person-walking');
    insertDept.run(6, 'Neurology', 'Diagnosis and advanced therapeutic management for neurological, brain, and spinal disorders.', 'bi-activity');
    insertDept.run(7, 'ENT (Ear, Nose & Throat)', 'Surgical and clinical management for ear, nasal cavity, sinus, throat, and hearing conditions.', 'bi-headset');
    insertDept.run(8, 'Gynecology & Obstetrics', 'Comprehensive women\'s health, prenatal & postnatal care, maternal wellness, and reproductive health.', 'bi-gender-female');

    // Seed users
    const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)');
    insertUser.run(1, 'System Administrator', 'admin@careconnect.com', '$2a$10$bmNAJHSJYYnd0yrG8SVmGOfPftXsSMGjadZR5ijs9ThH3q3T6/OwG', 'admin', '9876543210');
    insertUser.run(2, 'Dr. Rajesh Sharma', 'doctor@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012345');
    insertUser.run(3, 'Dr. Priya Venkatesh', 'priya.venkatesh@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012346');
    insertUser.run(4, 'Dr. Ananya Iyer', 'ananya.iyer@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012347');
    insertUser.run(5, 'Dr. Amit Verma', 'amit.verma@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012348');
    insertUser.run(6, 'Dr. Suresh Nair', 'suresh.nair@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012349');
    insertUser.run(7, 'Dr. Sneha Kulkarni', 'sneha.kulkarni@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012350');
    insertUser.run(8, 'Dr. Vikram Malhotra', 'vikram.malhotra@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012351');
    insertUser.run(9, 'Dr. Pooja Patel', 'pooja.patel@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012352');
    insertUser.run(10, 'Rahul Sharma', 'patient@careconnect.com', '$2a$10$5DMW89rUrqVxQ4uS6fEpz.yH/UaGpMjsN9LcwDoeV1xYMAvavVfU.', 'patient', '9123456780');
    insertUser.run(11, 'Snehal Deshmukh', 'snehal.deshmukh@gmail.com', '$2a$10$5DMW89rUrqVxQ4uS6fEpz.yH/UaGpMjsN9LcwDoeV1xYMAvavVfU.', 'patient', '9123456781');

    // Seed patients
    const insertPatient = db.prepare('INSERT OR IGNORE INTO patients (id, user_id, date_of_birth, gender, address, blood_group, emergency_contact) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertPatient.run(1, 10, '1998-05-15', 'Male', '42, Green Glen Layout, Bellandur, Bangalore, Karnataka - 560103', 'O+', '9123456789');
    insertPatient.run(2, 11, '2001-08-22', 'Female', '15B, Sunrise Avenue, Indiranagar, Bangalore, Karnataka - 560038', 'B+', '9123456788');

    // Seed doctors
    const insertDoc = db.prepare(`INSERT OR IGNORE INTO doctors 
      (id, user_id, department_id, name, email, specialization, qualification, experience, consultation_fee, available_days, available_timings, profile_image, description, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    insertDoc.run(1, 2, 1, 'Dr. Rajesh Sharma', 'doctor@careconnect.com', 'General Medicine', 'MBBS, MD (Internal Medicine), FACP', 14, 600.00, 'Monday - Saturday', '09:00 AM - 01:00 PM', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80', 'Senior consultant physician specializing in lifestyle disorders, infectious diseases, preventive health checkups, and diabetes management.', 1);
    insertDoc.run(2, 3, 2, 'Dr. Priya Venkatesh', 'priya.venkatesh@careconnect.com', 'Cardiology', 'MBBS, MD, DM (Cardiology), FESC', 12, 1000.00, 'Monday - Friday', '10:00 AM - 03:00 PM', 'https://images.unsplash.com/photo-1594824813620-bf02a466d3a8?w=500&auto=format&fit=crop&q=80', 'Distinguished interventional cardiologist specializing in cardiovascular diseases, coronary angiogram, heart failure prevention, and echocardiography.', 1);
    insertDoc.run(3, 4, 3, 'Dr. Ananya Iyer', 'ananya.iyer@careconnect.com', 'Dermatology', 'MBBS, MD (Dermatology, Venereology & Leprosy)', 9, 750.00, 'Tuesday - Saturday', '11:00 AM - 04:00 PM', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80', 'Board-certified dermatologist focusing on acne therapies, clinical dermatopathology, pediatric dermatology, and advanced skin rejuvenation therapies.', 1);
    insertDoc.run(4, 5, 4, 'Dr. Amit Verma', 'amit.verma@careconnect.com', 'Pediatrics', 'MBBS, DCH, MD (Pediatrics), FIAP', 11, 650.00, 'Monday - Saturday', '09:30 AM - 02:30 PM', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80', 'Dedicated pediatrician with comprehensive expertise in newborn care, child growth monitoring, childhood allergies, and adolescent health.', 1);
    insertDoc.run(5, 6, 5, 'Dr. Suresh Nair', 'suresh.nair@careconnect.com', 'Orthopedics', 'MBBS, MS (Orthopedics), M.Ch (Joint Replacement)', 16, 900.00, 'Monday, Wednesday, Friday', '02:00 PM - 07:00 PM', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80', 'Renowned orthopedic surgeon specializing in arthroscopy, sports trauma, minimally invasive knee & hip arthroplasty, and spine care.', 1);
    insertDoc.run(6, 7, 6, 'Dr. Sneha Kulkarni', 'sneha.kulkarni@careconnect.com', 'Neurology', 'MBBS, MD, DM (Neurology), FAAN', 10, 1100.00, 'Tuesday, Thursday, Saturday', '10:00 AM - 04:00 PM', 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&auto=format&fit=crop&q=80', 'Leading consultant neurologist treating epilepsy, stroke recovery, migraines, neurodegenerative disorders, and neuromuscular conditions.', 1);
    insertDoc.run(7, 8, 7, 'Dr. Vikram Malhotra', 'vikram.malhotra@careconnect.com', 'ENT (Ear, Nose & Throat)', 'MBBS, MS (ENT), DLO', 8, 700.00, 'Monday - Saturday', '09:00 AM - 01:00 PM', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=80', 'Expert ENT surgeon with proficiency in endoscopic sinus surgery, tympanoplasty, vertigo clinics, voice disorders, and pediatric otolaryngology.', 1);
    insertDoc.run(8, 9, 8, 'Dr. Pooja Patel', 'pooja.patel@careconnect.com', 'Gynecology & Obstetrics', 'MBBS, MS (Obstetrics & Gynecology), FMAS', 13, 850.00, 'Monday - Friday', '10:30 AM - 03:30 PM', 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=500&auto=format&fit=crop&q=80', 'Consultant obstetrician & gynecologist providing compassionate high-risk pregnancy management, PCOS care, and laparoscopic gynecological procedures.', 1);

    // Seed appointments
    const insertAppt = db.prepare(`INSERT OR IGNORE INTO appointments 
      (id, patient_id, doctor_id, appointment_date, appointment_time, reason, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`);
    
    insertAppt.run(1, 1, 1, '2026-10-02', '10:00 AM', 'Routine annual health checkup and blood pressure monitoring.', 'Confirmed');
    insertAppt.run(2, 1, 2, '2026-10-05', '11:30 AM', 'Consultation for mild chest discomfort and preventative ECG test.', 'Pending');
    insertAppt.run(3, 1, 3, '2026-09-15', '02:00 PM', 'Skin allergy consultation and prescribed ointment evaluation.', 'Completed');
    insertAppt.run(4, 2, 8, '2026-10-04', '11:00 AM', 'Routine prenatal maternal consultation and ultrasound review.', 'Confirmed');
    insertAppt.run(5, 2, 5, '2026-09-20', '03:30 PM', 'Right ankle sprain treatment and post-physiotherapy check.', 'Completed');
    insertAppt.run(6, 1, 6, '2026-09-10', '10:30 AM', 'Chronic migraine headache consultation.', 'Cancelled');
  }
}

/**
 * Universal query runner: executes parameterized queries seamlessly across MySQL and SQLite
 */
async function query(sql, params = []) {
  if (!pool && !sqliteDb) {
    await initDatabase();
  }

  if (dbType === 'mysql') {
    const [rows] = await pool.query(sql, params);
    return rows;
  } else {
    // SQLite execution
    const trimmedSql = sql.trim();
    // Translate standard MySQL date/format quirks if necessary
    const stmt = sqliteDb.prepare(trimmedSql);
    if (/^(SELECT|WITH|PRAGMA)/i.test(trimmedSql)) {
      return stmt.all(...params);
    } else {
      const result = stmt.run(...params);
      return {
        insertId: Number(result.lastInsertRowid),
        affectedRows: result.changes,
        changedRows: result.changes
      };
    }
  }
}

/**
 * Universal execute function
 */
async function execute(sql, params = []) {
  return query(sql, params);
}

function getDbType() {
  return dbType;
}

module.exports = {
  initDatabase,
  query,
  execute,
  getDbType
};
