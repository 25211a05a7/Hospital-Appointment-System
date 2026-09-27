/**
 * CareConnect Hospital Appointment System
 * Experiment 7: HTTP Sessions Demonstration
 * 
 * Demonstrates:
 * 1. Server-side session store with unique Session IDs (SID)
 * 2. Associating user state (e.g. cart/booking draft, user profile) to session
 * 3. Session expiry & TTL timeout
 * 4. Session invalidation (Logout)
 */

const http = require('http');
const crypto = require('crypto');

const PORT = 5056;
const sessions = new Map(); // Memory session storage: sessionId -> { data, expiresAt }
const SESSION_TTL_MS = 60 * 1000; // 60 seconds TTL

function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

const server = http.createServer((req, res) => {
  const url = req.url;
  const cookieHeader = req.headers.cookie || '';
  
  // Extract Session ID from cookie
  let sessionId = null;
  const match = cookieHeader.match(/careconnect_sid=([a-f0-9]+)/);
  if (match) {
    sessionId = match[1];
  }

  // Check if active valid session exists
  let session = null;
  if (sessionId && sessions.has(sessionId)) {
    const existing = sessions.get(sessionId);
    if (Date.now() < existing.expiresAt) {
      session = existing;
      // Sliding window expiration refresh
      existing.expiresAt = Date.now() + SESSION_TTL_MS;
    } else {
      sessions.delete(sessionId);
    }
  }

  if (url === '/login') {
    sessionId = generateSessionId();
    const newSession = {
      data: {
        userId: 10,
        userName: 'Rahul Sharma',
        role: 'patient',
        email: 'patient@careconnect.com',
        bookingDraft: { doctorId: 1, department: 'General Medicine' }
      },
      expiresAt: Date.now() + SESSION_TTL_MS
    };
    sessions.set(sessionId, newSession);

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': `careconnect_sid=${sessionId}; Path=/; HttpOnly; SameSite=Lax`
    });
    res.end(JSON.stringify({
      success: true,
      message: 'Session initialized and stored in server memory!',
      sessionId: sessionId,
      sessionData: newSession.data
    }));
    return;
  }

  if (url === '/profile') {
    if (!session) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'No active session or session has expired. Please login again.'
      }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Active session verified!',
      sessionId: sessionId,
      user: session.data,
      expiresInSeconds: Math.round((session.expiresAt - Date.now()) / 1000)
    }));
    return;
  }

  if (url === '/logout') {
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': 'careconnect_sid=; Max-Age=0; Path=/'
    });
    res.end(JSON.stringify({
      success: true,
      message: 'Session destroyed on server and cookie cleared.'
    }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h2>CareConnect Hospital - HTTP Session Demonstration</h2>
    <ul>
      <li><a href="/login">/login</a> - Start new authenticated session</li>
      <li><a href="/profile">/profile</a> - View session data</li>
      <li><a href="/logout">/logout</a> - Destroy session</li>
    </ul>
  `);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`======================================================`);
    console.log(` Session Demo Server running on http://localhost:${PORT}`);
    console.log(` Endpoints: /login , /profile , /logout`);
    console.log(`======================================================`);
  });
}

module.exports = server;
