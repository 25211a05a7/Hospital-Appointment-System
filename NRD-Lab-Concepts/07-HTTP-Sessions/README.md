# Experiment 7: HTTP Sessions Management

## 1. Overview
HTTP is a stateless protocol. HTTP Sessions maintain state across multiple requests by generating a unique session ID on the server, sending it to the client via a cookie, and associating session attributes (e.g. user authentication, draft appointments) on the server memory or database.

## 2. Files
- `session_demo.js`: Standalone Node.js HTTP server demonstrating session lifecycle, TTL expiration, sliding window timeouts, and server-side state destruction.

## 3. How to Run
```bash
node session_demo.js
```

## 4. Test with cURL:
```bash
# 1. Login and obtain session cookie
curl -c session_cookies.txt http://localhost:5056/login

# 2. Access protected profile using session cookie
curl -b session_cookies.txt http://localhost:5056/profile

# 3. Destroy session
curl -b session_cookies.txt -c session_cookies.txt http://localhost:5056/logout
```
