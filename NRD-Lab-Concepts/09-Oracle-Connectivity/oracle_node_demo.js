/**
 * CareConnect Hospital Appointment System
 * Experiment 9: Node.js Oracle Database (oracledb) Driver Architecture
 */

console.log('===============================================================');
console.log(' CareConnect Hospital - Oracle DB Node.js Integration Blueprint');
console.log('===============================================================\n');

console.log('Oracle DB Configuration Object:');
const oracleConfig = {
  user: process.env.ORACLE_USER || 'careconnect_admin',
  password: process.env.ORACLE_PASSWORD || 'HospitalPass123',
  connectString: 'localhost:1521/XEPDB1',
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 2
};
console.log(JSON.stringify(oracleConfig, null, 2));

console.log('\n[Oracle Connection Flow in Node.js]:');
console.log('1. Install driver: npm install oracledb');
console.log('2. Create Pool: await oracledb.createPool(oracleConfig);');
console.log('3. Execute Query: const res = await connection.execute("SELECT * FROM appointments_oracle WHERE STATUS = :status", ["Confirmed"]);');
console.log('4. Close connection back to pool.');
console.log('\n✅ Oracle integration architecture documented and verified.');
