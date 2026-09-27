/**
 * CareConnect Hospital Appointment System
 * Experiment 6: Cookies Management Demonstration
 * 
 * Demonstrates:
 * 1. Setting persistent cookies (Remember User email)
 * 2. Setting secure HttpOnly session cookies
 * 3. Reading incoming request cookies
 * 4. Clearing/deleting cookies on logout
 */

const http = require('http');

const PORT = 5055;

const server = http.createServer((req, res) => {
  const url = req.url;
  const cookieHeader = req.headers.cookie || '';

  console.log(`[HTTP Request] ${req.method} ${url} | Raw Cookie Header: "${cookieHeader}"`);

  // Parse cookies
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const parts = c.split('=');
    if (parts.length === 2) {
      cookies[parts[0].trim()] = decodeURIComponent(parts[1].trim());
    }
  });

  if (url === '/set-cookie') {
    // Set 2 cookies: 1 persistent (7 days) and 1 session cookie
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': [
        'careconnect_user=patient@careconnect.com; Max-Age=604800; Path=/; SameSite=Lax',
        'careconnect_pref=dark_theme; Path=/; HttpOnly'
      ]
    });
    res.end(JSON.stringify({
      success: true,
      message: 'Cookies set successfully in browser headers!',
      cookiesSet: ['careconnect_user', 'careconnect_pref']
    }));
    return;
  }

  if (url === '/get-cookie') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      receivedCookies: cookies,
      hasUserCookie: Boolean(cookies['careconnect_user'])
    }));
    return;
  }

  if (url === '/clear-cookie') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Set-Cookie': [
        'careconnect_user=; Max-Age=0; Path=/',
        'careconnect_pref=; Max-Age=0; Path=/'
      ]
    });
    res.end(JSON.stringify({
      success: true,
      message: 'Cookies cleared from client!'
    }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h2>CareConnect Hospital - Cookie Demonstration</h2>
    <p>Endpoints:</p>
    <ul>
      <li><a href="/set-cookie">/set-cookie</a> - Set persistent & session cookies</li>
      <li><a href="/get-cookie">/get-cookie</a> - Read client cookies</li>
      <li><a href="/clear-cookie">/clear-cookie</a> - Invalidate cookies</li>
    </ul>
  `);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`======================================================`);
    console.log(` Cookie Demo Server running on http://localhost:${PORT}`);
    console.log(` Endpoints: /set-cookie , /get-cookie , /clear-cookie`);
    console.log(`======================================================`);
  });
}

module.exports = server;
