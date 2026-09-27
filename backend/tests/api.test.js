/**
 * Automated API Test Suite for CareConnect Hospital Appointment System
 * Tests: Health, Auth (Register/Login/JWT), Doctors, Appointments, Conflict Prevention, Dashboards, Roles
 */

const http = require('http');
const app = require('../src/server');
const { initDatabase } = require('../src/config/db');

let server;
let baseUrl = '';

let adminToken = '';
let doctorToken = '';
let patientToken = '';
let createdAppointmentId = null;
const randomDay = 10 + Math.floor(Math.random() * 15);
const randomHour = 8 + Math.floor(Math.random() * 4);
const testDate = `2027-11-${String(randomDay).padStart(2, '0')}`;
const testSlot = `${String(randomHour).padStart(2, '0')}:00 AM`;

// Helper for making HTTP requests in tests
function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

const tests = [];
let passedCount = 0;
let failedCount = 0;

function it(name, fn) {
  tests.push({ name, fn });
}

async function runTests() {
  console.log('\n======================================================');
  console.log(' RUNNING CARECONNECT HOSPITAL AUTOMATED API TESTS');
  console.log('======================================================\n');

  // Start test server on dynamic port
  await initDatabase();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`[Test Server] Running on ${baseUrl}\n`);
      resolve();
    });
  });

  for (const t of tests) {
    try {
      await t.fn();
      console.log(` ✅ PASS: ${t.name}`);
      passedCount++;
    } catch (err) {
      console.error(` ❌ FAIL: ${t.name}`);
      console.error(`    Error: ${err.message}`);
      failedCount++;
    }
  }

  console.log('\n======================================================');
  console.log(` TEST SUMMARY: ${passedCount} Passed, ${failedCount} Failed`);
  console.log('======================================================\n');

  server.close();
  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// ----------------------------------------------------
// 1. Health Check Test
// ----------------------------------------------------
it('1. GET /api/health should return UP status and database type', async () => {
  const res = await request('GET', '/api/health');
  if (res.status !== 200 || res.body.status !== 'UP') {
    throw new Error(`Expected status 200 UP, got ${res.status} ${JSON.stringify(res.body)}`);
  }
});

// ----------------------------------------------------
// 2. Authentication - Admin Login
// ----------------------------------------------------
it('2. POST /api/auth/login with Admin credentials should return JWT token', async () => {
  const res = await request('POST', '/api/auth/login', {
    email: 'admin@careconnect.com',
    password: 'Admin@123'
  });
  if (res.status !== 200 || !res.body.token || res.body.user.role !== 'admin') {
    throw new Error(`Admin login failed: ${JSON.stringify(res.body)}`);
  }
  adminToken = res.body.token;
});

// ----------------------------------------------------
// 3. Authentication - Doctor Login
// ----------------------------------------------------
it('3. POST /api/auth/login with Doctor credentials should return JWT token', async () => {
  const res = await request('POST', '/api/auth/login', {
    email: 'doctor@careconnect.com',
    password: 'Doctor@123'
  });
  if (res.status !== 200 || !res.body.token || res.body.user.role !== 'doctor') {
    throw new Error(`Doctor login failed: ${JSON.stringify(res.body)}`);
  }
  doctorToken = res.body.token;
});

// ----------------------------------------------------
// 4. Authentication - Patient Login
// ----------------------------------------------------
it('4. POST /api/auth/login with Patient credentials should return JWT token', async () => {
  const res = await request('POST', '/api/auth/login', {
    email: 'patient@careconnect.com',
    password: 'Patient@123'
  });
  if (res.status !== 200 || !res.body.token || res.body.user.role !== 'patient') {
    throw new Error(`Patient login failed: ${JSON.stringify(res.body)}`);
  }
  patientToken = res.body.token;
});

// ----------------------------------------------------
// 5. Patient Registration & Duplicate Prevention
// ----------------------------------------------------
it('5. POST /api/auth/register should register new patient and reject duplicates', async () => {
  const randomSuffix = Math.floor(Math.random() * 10000);
  const testEmail = `testpatient${randomSuffix}@example.com`;

  // Successful registration
  const regRes = await request('POST', '/api/auth/register', {
    name: 'Anjali Sharma',
    email: testEmail,
    phone: '9876543210',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    dateOfBirth: '1995-04-12',
    gender: 'Female',
    address: 'Koramangala, Bangalore'
  });

  if (regRes.status !== 201 || !regRes.body.token) {
    throw new Error(`Registration failed: ${JSON.stringify(regRes.body)}`);
  }

  // Duplicate registration check
  const dupRes = await request('POST', '/api/auth/register', {
    name: 'Anjali Sharma',
    email: testEmail,
    phone: '9876543210',
    password: 'Password@123',
    confirmPassword: 'Password@123'
  });

  if (dupRes.status !== 409) {
    throw new Error(`Expected duplicate email conflict 409, got ${dupRes.status}`);
  }
});

// ----------------------------------------------------
// 6. Doctors Catalog and Filters
// ----------------------------------------------------
it('6. GET /api/doctors should return doctor list and support specialization filter', async () => {
  const allRes = await request('GET', '/api/doctors');
  if (allRes.status !== 200 || !Array.isArray(allRes.body.doctors) || allRes.body.doctors.length < 8) {
    throw new Error(`Expected at least 8 doctors, got ${allRes.body.doctors?.length}`);
  }

  const cardioRes = await request('GET', '/api/doctors?specialization=Cardiology');
  if (cardioRes.status !== 200 || cardioRes.body.doctors.some(d => d.specialization !== 'Cardiology')) {
    throw new Error(`Filter by specialization failed: ${JSON.stringify(cardioRes.body)}`);
  }
});

// ----------------------------------------------------
// 7. Appointment Booking Workflow
// ----------------------------------------------------
it('7. POST /api/appointments should book appointment successfully for future date', async () => {
  const res = await request('POST', '/api/appointments', {
    doctor_id: 1,
    appointment_date: testDate,
    appointment_time: testSlot,
    reason: 'Severe migraine headache and routine check'
  }, patientToken);

  if (res.status !== 201 || !res.body.appointment) {
    throw new Error(`Appointment booking failed: ${JSON.stringify(res.body)}`);
  }

  createdAppointmentId = res.body.appointment.id;
});

// ----------------------------------------------------
// 8. Duplicate Slot Booking Conflict Prevention
// ----------------------------------------------------
it('8. POST /api/appointments should prevent duplicate bookings for same doctor & slot', async () => {
  const dupRes = await request('POST', '/api/appointments', {
    doctor_id: 1,
    appointment_date: testDate,
    appointment_time: testSlot,
    reason: 'Another booking for same time slot'
  }, patientToken);

  if (dupRes.status !== 409) {
    throw new Error(`Expected 409 conflict for duplicate doctor slot, got ${dupRes.status}`);
  }
});

// ----------------------------------------------------
// 9. Past Date Prevention
// ----------------------------------------------------
it('9. POST /api/appointments should reject booking dates in the past', async () => {
  const pastRes = await request('POST', '/api/appointments', {
    doctor_id: 1,
    appointment_date: '2020-01-01',
    appointment_time: '10:00 AM',
    reason: 'Backdated appointment test'
  }, patientToken);

  if (pastRes.status !== 400) {
    throw new Error(`Expected 400 Bad Request for past date, got ${pastRes.status}`);
  }
});

// ----------------------------------------------------
// 10. Doctor Authorization on Status Update
// ----------------------------------------------------
it('10. PATCH /api/appointments/:id/status should allow assigned doctor to update status', async () => {
  const res = await request('PATCH', `/api/appointments/${createdAppointmentId}/status`, {
    status: 'Confirmed'
  }, doctorToken);

  if (res.status !== 200) {
    throw new Error(`Doctor status update failed: ${JSON.stringify(res.body)}`);
  }
});

// ----------------------------------------------------
// 11. Patient Cancellation
// ----------------------------------------------------
it('11. PATCH /api/appointments/:id/cancel should allow patient to cancel their appointment', async () => {
  const res = await request('PATCH', `/api/appointments/${createdAppointmentId}/cancel`, {}, patientToken);
  if (res.status !== 200) {
    throw new Error(`Patient cancellation failed: ${JSON.stringify(res.body)}`);
  }
});

// ----------------------------------------------------
// 12. Admin Dashboard Statistics & Chart Data
// ----------------------------------------------------
it('12. GET /api/dashboard/stats with Admin token should return comprehensive metrics and chart data', async () => {
  const res = await request('GET', '/api/dashboard/stats', null, adminToken);
  if (res.status !== 200 || !res.body.stats || !res.body.stats.chartStatus) {
    throw new Error(`Admin dashboard stats failed: ${JSON.stringify(res.body)}`);
  }
});

// ----------------------------------------------------
// 13. RBAC Route Protection Check
// ----------------------------------------------------
it('13. POST /api/doctors should reject unauthorized patient requests with 403 Forbidden', async () => {
  const res = await request('POST', '/api/doctors', {
    name: 'Hacker Doc',
    email: 'hacker@example.com',
    specialization: 'General',
    qualification: 'None'
  }, patientToken);

  if (res.status !== 403) {
    throw new Error(`Expected 403 Forbidden for patient adding doctor, got ${res.status}`);
  }
});

// Run all test suites
runTests();
