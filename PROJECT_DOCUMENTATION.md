# CareConnect Hospital — Complete Project Documentation

## 1. Project Information
- **Project Name**: Hospital Appointment System
- **Website Name**: CareConnect Hospital
- **Tagline**: *Quality Healthcare, Simplified.*
- **Batch**: B9 (CSE Department)
- **Team Size**: 5 Students
- **Submission Deadline**: 30 September 2026

---

## 2. Executive Summary & Problem Statement
Traditional hospital outpatient management often suffers from long waiting queues, manual scheduling errors, double booking of consulting specialists, and lack of real-time visibility for patients and doctors. 

**CareConnect Hospital Appointment System** addresses these critical challenges by providing a full-stack web application that facilitates:
- Real-time doctor slot lookup and automated conflict prevention.
- Seamless multi-role portals for Patients, Doctors, and Hospital Administrators.
- Transparent fee tracking, medical specialization browsing, and instant appointment booking confirmations.
- Comprehensive analytics for hospital executives via interactive Chart.js dashboards.

---

## 3. Technology Stack Architecture

```
+-------------------------------------------------------------+
|                      Client Layer (SPA)                     |
|  React.js 18 + React Router 6 + Bootstrap 5 + Chart.js      |
+------------------------------+------------------------------+
                               |
                        HTTPS / JSON REST API
                               |
+------------------------------v------------------------------+
|                     Backend Server Layer                    |
|  Node.js + Express.js + JWT Auth + RBAC + Bcryptjs          |
+------------------------------+------------------------------+
                               |
                        SQL Parameterized Queries
                               |
+------------------------------v------------------------------+
|                    Database Storage Layer                   |
|  MySQL 8.0 (InnoDB) / Relational Schema + Foreign Keys     |
+-------------------------------------------------------------+
```

### End-to-End Data Pipeline:
$$\text{React User Interaction} \longrightarrow \text{REST API Call (JSON)} \longrightarrow \text{Express Controller} \longrightarrow \text{Parameterized SQL} \longrightarrow \text{MySQL DB} \longrightarrow \text{JSON Response} \longrightarrow \text{React State UI Update}$$

---

## 4. Database Schema Design

### Relational Entity-Relationship Structure
1. **`departments`**:
   - `id` (PK, INT, AUTO_INCREMENT)
   - `name` (VARCHAR(100), UNIQUE)
   - `description` (TEXT)
   - `icon` (VARCHAR(50))
   - `created_at` (TIMESTAMP)

2. **`users`**:
   - `id` (PK, INT, AUTO_INCREMENT)
   - `name` (VARCHAR(150))
   - `email` (VARCHAR(150), UNIQUE)
   - `password` (VARCHAR(255) - Bcrypt hashed)
   - `role` (ENUM('patient', 'doctor', 'admin'))
   - `phone` (VARCHAR(20))
   - `created_at`, `updated_at` (TIMESTAMP)

3. **`patients`**:
   - `id` (PK, INT, AUTO_INCREMENT)
   - `user_id` (FK -> `users.id` ON DELETE CASCADE)
   - `date_of_birth` (DATE)
   - `gender` (ENUM('Male', 'Female', 'Other'))
   - `address` (TEXT)
   - `blood_group` (VARCHAR(10))
   - `emergency_contact` (VARCHAR(20))

4. **`doctors`**:
   - `id` (PK, INT, AUTO_INCREMENT)
   - `user_id` (FK -> `users.id` ON DELETE SET NULL)
   - `department_id` (FK -> `departments.id` ON DELETE SET NULL)
   - `name` (VARCHAR(150))
   - `email` (VARCHAR(150), UNIQUE)
   - `specialization` (VARCHAR(100))
   - `qualification` (VARCHAR(150))
   - `experience` (INT)
   - `consultation_fee` (DECIMAL(10,2))
   - `available_days` (VARCHAR(100))
   - `available_timings` (VARCHAR(100))
   - `profile_image` (VARCHAR(255))
   - `description` (TEXT)
   - `is_active` (BOOLEAN DEFAULT TRUE)

5. **`appointments`**:
   - `id` (PK, INT, AUTO_INCREMENT)
   - `patient_id` (FK -> `patients.id` ON DELETE CASCADE)
   - `doctor_id` (FK -> `doctors.id` ON DELETE CASCADE)
   - `appointment_date` (DATE)
   - `appointment_time` (VARCHAR(20))
   - `reason` (TEXT)
   - `status` (ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'))
   - `CONSTRAINT uq_doctor_slot UNIQUE (doctor_id, appointment_date, appointment_time)`

---

## 5. Security & Validation Safeguards
1. **Password Hashing**: 10-round salted bcrypt hashes protect user credentials in storage.
2. **JWT Authentication**: Stateless token authorization via `Authorization: Bearer <token>` with expiration validation.
3. **Role-Based Access Control (RBAC)**:
   - Admin: Doctor CRUD, patient database inspection, global appointment overrides, executive metrics.
   - Doctor: View and update status for assigned patients only.
   - Patient: Search doctors, self-schedule appointments, view personal appointment history, cancellation.
4. **Availability & Slot Conflict Enforcement**:
   - Backend prevents booking dates in the past.
   - Prevents duplicate time slot bookings for the same doctor.
