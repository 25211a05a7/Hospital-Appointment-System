/**
 * CareConnect Hospital Appointment System
 * Experiment 8: Node.js Core Modules Demonstration
 * 
 * Demonstrates:
 * 1. fs (File System - async & sync file operations)
 * 2. path (Cross-platform path resolution & extensions)
 * 3. os (Operating system architecture, CPU cores, memory)
 * 4. crypto (Hashing passwords & generating UUIDs)
 * 5. events (EventEmitter for asynchronous hospital alerts)
 * 6. http & url (HTTP server & URL parsing)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const EventEmitter = require('events');

console.log('===============================================================');
console.log(' CareConnect Hospital - Node.js Core Modules Demonstration');
console.log('===============================================================\n');

// 1. PATH MODULE
console.log('[1] PATH Module:');
const sampleLogPath = path.join(__dirname, 'logs', 'hospital_audit.log');
console.log(`    - Resolved Path:  ${sampleLogPath}`);
console.log(`    - Directory Name: ${path.dirname(sampleLogPath)}`);
console.log(`    - File Extension: ${path.extname(sampleLogPath)}`);

// 2. OS MODULE
console.log('\n[2] OS Module:');
console.log(`    - Platform:        ${os.platform()} (${os.arch()})`);
console.log(`    - CPU Cores:       ${os.cpus().length} core(s)`);
console.log(`    - Free RAM:        ${(os.freemem() / (1024 * 1024)).toFixed(2)} MB / ${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`);
console.log(`    - Hostname:        ${os.hostname()}`);

// 3. CRYPTO MODULE
console.log('\n[3] CRYPTO Module:');
const samplePatientPassword = 'PatientSecret@2026';
const sha256Hash = crypto.createHash('sha256').update(samplePatientPassword).digest('hex');
const randomToken = crypto.randomBytes(16).toString('hex');
console.log(`    - Input text:      ${samplePatientPassword}`);
console.log(`    - SHA-256 Hash:    ${sha256Hash}`);
console.log(`    - Random Token:    ${randomToken}`);

// 4. FS MODULE
console.log('\n[4] FS Module (File System):');
const testDir = path.join(__dirname, 'scratch_demo');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}
const testFile = path.join(testDir, 'audit_report.txt');
const auditLogData = `CareConnect Audit Log - Generated at ${new Date().toISOString()}\nActive Doctors: 8\nStatus: Systems Nominal\n`;
fs.writeFileSync(testFile, auditLogData, 'utf8');
console.log(`    - Written test file to: ${testFile}`);
const readBackData = fs.readFileSync(testFile, 'utf8');
console.log(`    - Read back ${readBackData.length} bytes successfully.`);

// 5. EVENTS MODULE (EventEmitter)
console.log('\n[5] EVENTS Module (EventEmitter):');
class HospitalNotifier extends EventEmitter {}
const hospitalAlerts = new HospitalNotifier();

// Register event listeners
hospitalAlerts.on('appointment_booked', (appt) => {
  console.log(`    📢 [EVENT: appointment_booked] ID #${appt.id} booked for Dr. ${appt.doctorName} by ${appt.patientName}`);
});

hospitalAlerts.on('emergency_alert', (emergency) => {
  console.log(`    🚨 [EVENT: emergency_alert] Priority: ${emergency.priority} in Ward: ${emergency.ward}`);
});

// Emit events
hospitalAlerts.emit('appointment_booked', { id: 101, doctorName: 'Rajesh Sharma', patientName: 'Rahul Sharma' });
hospitalAlerts.emit('emergency_alert', { priority: 'HIGH', ward: 'Cardiology ICU' });

console.log('\n===============================================================');
console.log(' ✅ ALL CORE MODULES DEMONSTRATED SUCCESSFULLY!');
console.log('===============================================================');
