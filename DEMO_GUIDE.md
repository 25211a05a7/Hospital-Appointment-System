# CareConnect Hospital — Step-by-Step Faculty Demonstration Guide

Follow this guided walkthrough during the practical examination and project review.

---

## 1. Quick Startup Commands

### Start Backend:
```bash
cd Hospital-Appointment-System/backend
npm start
```
*Backend runs on: `http://localhost:5000` (Database auto-initializes upon launch)*

### Start Frontend:
```bash
cd Hospital-Appointment-System/frontend
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 2. Demonstration Flow

### Step 1: Public Homepage & Doctor Discovery
1. Open `http://localhost:5173` in your browser.
2. Observe the modern healthcare theme (Blue/Teal/White), responsive navigation, and hospital statistics.
3. Click on **"Our Doctors"** in the navigation bar.
4. Filter by Specialization (e.g. *Cardiology* or *Neurology*) or search for "Sharma".
5. Click **"View Profile"** on Dr. Rajesh Sharma to view qualifications, experience, and consultation schedule.

### Step 2: Patient Registration & 1-Click Login
1. Click **"Book Appointment"** or navigate to **"Login"**.
2. Click the quick **"Demo Patient"** button (or sign up with new credentials).
3. The dashboard opens displaying the Patient Dashboard with upcoming appointment counts.

### Step 3: Interactive Appointment Booking
1. Click **"Book Appointment"** from the Patient Dashboard.
2. Select **Dr. Rajesh Sharma** (General Medicine).
3. Select a future date (e.g., tomorrow or next week).
4. Select an available time slot (e.g., `10:00 AM`).
5. Enter Reason for Visit: *"Routine blood pressure monitoring and consultation"*.
6. Click **"Confirm & Book"** -> A success toast notification is displayed.
7. Navigate to **"My Appointments"** to see the new booking listed with "Confirmed" badge.

### Step 4: Duplicate Slot Conflict Prevention Demo
1. Attempt to book another appointment with **Dr. Rajesh Sharma** on the *exact same date and time slot*.
2. Observe the intelligent error modal/toast preventing duplicate double-booking!

### Step 5: Doctor Portal Flow
1. Logout from the top navigation.
2. Click **"Login"** -> Click the **"Demo Doctor"** button (`doctor@careconnect.com`).
3. View **Doctor Dashboard** showcasing assigned patients, today's schedule, and status actions.
4. Go to **"Doctor Appointments"** -> Click **"Mark Completed"** on an appointment.

### Step 6: Admin Dashboard & Chart.js Analytics
1. Logout and click **"Demo Admin"** (`admin@careconnect.com`).
2. Explore the **Admin Dashboard**:
   - Total Patients, Total Doctors, Total Appointments metrics.
   - **Chart.js Visualizations**: Status Distribution Doughnut Chart and Monthly Bookings Trend Bar Chart.
3. Navigate to **"Manage Doctors"**:
   - Click **"Add Doctor"** to add a new doctor record into MySQL.
   - Edit or toggle active status of doctors.
4. Navigate to **"Manage Appointments"** to inspect hospital-wide schedules.

---

## 3. Demo Credentials Reference Table

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@careconnect.com` | `Admin@123` | Full Hospital Management, Doctor CRUD, Analytics |
| **Doctor** | `doctor@careconnect.com` | `Doctor@123` | View assigned appointments, Update appointment status |
| **Patient** | `patient@careconnect.com` | `Patient@123` | Search doctors, Book appointments, Manage personal visits |
