# CareConnect Hospital — Appointment Booking & Management System

> **NRD Lab Final Project — Batch B9 (CSE Department)**  
> **Tagline**: *Quality Healthcare, Simplified.*  
> **Submission Deadline**: 30 September 2026

---

## 🏥 Project Overview
**CareConnect Hospital** is a full-stack healthcare appointment scheduling and hospital management platform. The system bridges patients, specialized medical practitioners, and hospital administration with real-time slot scheduling, automated conflict prevention, secure JWT role-based access control, and visual analytics powered by Chart.js.

---

## 🛠️ Technology Stack
- **Frontend**: React.js 18, React Router 6, Bootstrap 5, Bootstrap Icons, Chart.js, Vite
- **Backend**: Node.js, Express.js REST APIs, JWT (JSON Web Tokens), Bcryptjs
- **Database**: MySQL 8.0 (Relational schema with Foreign Keys and Indexes)
- **Testing & Tooling**: Postman Collection (`postman/`), Automated API Test Suite, Git

---

## 📂 Project Directory Structure
```
Hospital-Appointment-System/
├── backend/                  # Node.js + Express REST API server
│   ├── src/
│   │   ├── config/           # Database adapter & initialization
│   │   ├── controllers/      # Auth, Doctors, Appointments, Dashboard controllers
│   │   ├── middleware/       # JWT Auth, Roles (RBAC), Error Handler
│   │   ├── routes/           # REST API Route declarations
│   │   └── server.js         # Server entry point
│   ├── tests/                # Automated API test suite
│   ├── .env.example          # Environment variables template
│   └── package.json
├── frontend/                 # React SPA (Vite + React Router + Bootstrap 5 + Chart.js)
│   ├── src/
│   │   ├── components/       # Navbar, Footer, ProtectedRoute, Modals
│   │   ├── context/          # AuthContext for state & JWT management
│   │   ├── pages/            # 22 Complete Pages (Public, Patient, Doctor, Admin)
│   │   ├── services/         # API client & Axios/Fetch wrappers
│   │   ├── App.jsx           # Master route hierarchy
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── database/                 # Database Schema & Seed scripts
│   ├── schema.sql            # MySQL table schemas & constraints
│   └── seed.sql              # 8 Doctors, Departments, Admin, Sample Data
├── postman/                  # Postman test collection
│   └── HospitalAppointment.postman_collection.json
├── NRD-Lab-Concepts/         # 10 NRD Lab Experiments with Code & Readmes
│   ├── 01-Java-JDBC-CRUD/
│   ├── 02-XML/
│   ├── 03-DTD/
│   ├── 04-XSD/
│   ├── 05-Java-Servlets/
│   ├── 06-Cookies/
│   ├── 07-HTTP-Sessions/
│   ├── 08-NodeJS-Core-Modules/
│   ├── 09-Oracle-Connectivity/
│   └── 10-External-API-Weather/
├── README.md                 # Project Overview & Setup Instructions
├── PROJECT_DOCUMENTATION.md  # Architectural and Design Specifications
├── API_DOCUMENTATION.md      # REST API Endpoints Specification
├── NRD-CONCEPT-COVERAGE.md   # Concept verification matrix
├── VIVA_QUESTIONS.md         # Comprehensive viva answers
├── TEAM_CONTRIBUTIONS.md     # Team roles breakdown
└── DEMO_GUIDE.md             # Faculty demonstration step-by-step
```

---

## 🚀 Quick Setup & Execution

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed      # Populates MySQL / local database tables and initial records
npm start         # Starts REST API on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev       # Starts React Application on http://localhost:5173
```

### 3. Run Automated Tests
```bash
cd ../backend
npm test          # Runs all 13 automated API test suites
```

---

## 🔑 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@careconnect.com` | `Admin@123` |
| **Specialist Doctor** | `doctor@careconnect.com` | `Doctor@123` |
| **Registered Patient**| `patient@careconnect.com` | `Patient@123` |

*Convenient 1-Click Demo Login buttons are also available on the `/login` page.*
