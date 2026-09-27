# CareConnect Hospital — REST API Specification

**Base URL**: `http://localhost:5000/api`

---

## 1. System & Health
### `GET /health`
- **Description**: Returns server status, database engine, and uptime.
- **Access**: Public
- **Response**:
```json
{
  "status": "UP",
  "timestamp": "2026-09-27T16:00:00.000Z",
  "service": "CareConnect Hospital Appointment System API",
  "version": "1.0.0",
  "database": "mysql"
}
```

---

## 2. Authentication Endpoints
### `POST /auth/register`
- **Description**: Registers a new patient.
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Rahul Sharma",
  "email": "patient@careconnect.com",
  "phone": "9123456780",
  "password": "Patient@123",
  "confirmPassword": "Patient@123",
  "dateOfBirth": "1998-05-15",
  "gender": "Male",
  "address": "42, Green Glen Layout, Bangalore"
}
```
- **Response**: `201 Created` with JWT token and user profile object.

### `POST /auth/login`
- **Description**: Authenticates user and generates JWT token.
- **Access**: Public
- **Request Body**:
```json
{
  "email": "patient@careconnect.com",
  "password": "Patient@123"
}
```
- **Response**: `200 OK` with `{ token, user }`.

### `GET /auth/profile`
- **Description**: Returns logged in user profile.
- **Access**: Bearer Token (Any authenticated user)

### `PUT /auth/profile`
- **Description**: Updates profile details (name, phone, address, blood group).
- **Access**: Bearer Token (Any authenticated user)

---

## 3. Doctors Endpoints
### `GET /doctors`
- **Description**: List all doctors with optional search and filters.
- **Query Params**: `search`, `department`, `specialization`, `active`
- **Access**: Public

### `GET /doctors/:id`
- **Description**: Retrieve doctor profile by ID.
- **Access**: Public

### `POST /doctors`
- **Description**: Add new doctor profile.
- **Access**: Admin only (`Authorization: Bearer <admin_token>`)

### `PUT /doctors/:id`
- **Description**: Modify existing doctor profile.
- **Access**: Admin only

### `DELETE /doctors/:id`
- **Description**: Deactivate or remove doctor.
- **Access**: Admin only

---

## 4. Appointments Endpoints
### `POST /appointments`
- **Description**: Schedule an appointment with conflict verification.
- **Access**: Patient or Admin
- **Request Body**:
```json
{
  "doctor_id": 1,
  "appointment_date": "2026-10-15",
  "appointment_time": "10:30 AM",
  "reason": "Routine checkup and consultation"
}
```

### `GET /appointments`
- **Description**: List appointments (Admin: all; Doctor: assigned; Patient: personal).
- **Access**: Authenticated

### `GET /appointments/my`
- **Description**: List personal appointments.
- **Access**: Authenticated

### `GET /appointments/:id`
- **Description**: Retrieve detailed appointment record with printable metadata.
- **Access**: Owner Patient, Assigned Doctor, or Admin

### `PATCH /appointments/:id/status`
- **Description**: Update appointment status (`Pending`, `Confirmed`, `Cancelled`, `Completed`).
- **Access**: Assigned Doctor or Admin

### `PATCH /appointments/:id/cancel`
- **Description**: Cancel appointment.
- **Access**: Owner Patient, Assigned Doctor, or Admin

---

## 5. Dashboard Endpoints
### `GET /dashboard/stats`
- **Description**: Aggregates role-specific metrics, counts, and Chart.js datasets.
- **Access**: Authenticated
