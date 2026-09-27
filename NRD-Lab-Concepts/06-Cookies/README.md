# Experiment 6: Cookies Management

## 1. Overview
Cookies are small pieces of data stored on the client browser and transmitted in HTTP request headers (`Cookie: name=value`). This experiment demonstrates setting persistent cookies (`Max-Age`), session cookies, `HttpOnly` security flags, reading cookies, and destroying cookies upon logout.

## 2. Files
- `cookie_demo.js`: Standalone Node.js HTTP server handling cookie headers.

## 3. How to Run
```bash
node cookie_demo.js
```

## 4. Test with cURL:
```bash
# 1. Set cookie and save cookie jar
curl -c cookies.txt http://localhost:5055/set-cookie

# 2. Send request with cookie jar
curl -b cookies.txt http://localhost:5055/get-cookie

# 3. Clear cookie
curl -b cookies.txt -c cookies.txt http://localhost:5055/clear-cookie
```
