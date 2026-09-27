# Experiment 8: Node.js Core Modules

## 1. Overview
Node.js provides a rich set of built-in core modules that require no external installation. This experiment demonstrates the most widely used modules: `fs` (file system), `path` (file paths), `os` (system metrics), `crypto` (hashing and token generation), and `events` (Event-driven architecture).

## 2. Files
- `core_modules_demo.js`: Executable script testing all 5 core modules.

## 3. How to Run
```bash
node core_modules_demo.js
```

## 4. Expected Output
```text
===============================================================
 CareConnect Hospital - Node.js Core Modules Demonstration
===============================================================

[1] PATH Module:
    - Resolved Path:  ...\logs\hospital_audit.log
    - Directory Name: ...\logs
    - File Extension: .log

[2] OS Module:
    - Platform:        win32 (x64)
    - CPU Cores:       16 core(s)
    - Free RAM:        12500 MB / 32 GB
    - Hostname:        DESKTOP-CSE

[3] CRYPTO Module:
    - Input text:      PatientSecret@2026
    - SHA-256 Hash:    1a2b3c4d5e...
    - Random Token:    d9f8e7c6b5...

[4] FS Module (File System):
    - Written test file to: ...\scratch_demo\audit_report.txt
    - Read back 88 bytes successfully.

[5] EVENTS Module (EventEmitter):
    📢 [EVENT: appointment_booked] ID #101 booked for Dr. Rajesh Sharma by Rahul Sharma
    🚨 [EVENT: emergency_alert] Priority: HIGH in Ward: Cardiology ICU

===============================================================
 ✅ ALL CORE MODULES DEMONSTRATED SUCCESSFULLY!
===============================================================
```
