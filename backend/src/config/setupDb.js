const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runSeed() {
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_USER = process.env.DB_USER || 'root';
  const DB_PASSWORD = process.env.DB_PASSWORD || '';
  const DB_NAME = process.env.DB_NAME || 'hospital_appointment';
  const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);

  console.log('--- Initializing CareConnect Hospital Database ---');
  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
      multipleStatements: true
    });

    console.log(`[MySQL] Connected to MySQL host ${DB_HOST}:${DB_PORT}`);
    
    const schemaSql = fs.readFileSync(path.join(__dirname, '../../../database/schema.sql'), 'utf-8');
    const seedSql = fs.readFileSync(path.join(__dirname, '../../../database/seed.sql'), 'utf-8');

    console.log('[MySQL] Applying schema.sql...');
    await conn.query(schemaSql);

    console.log('[MySQL] Applying seed.sql...');
    await conn.query(seedSql);

    await conn.end();
    console.log('✅ [MySQL] Database initialized and seeded successfully!');
  } catch (err) {
    console.warn(`[Setup] MySQL seed failed (${err.message}).`);
    console.log('[Setup] Verifying local SQLite database instead...');
    const { initDatabase } = require('./db');
    process.env.USE_SQLITE = 'true';
    await initDatabase();
    console.log('✅ [SQLite] Database initialized and seeded successfully!');
  }
}

if (require.main === module) {
  runSeed().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = runSeed;
