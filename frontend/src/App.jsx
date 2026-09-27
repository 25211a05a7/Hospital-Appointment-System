import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import OurDoctors from './pages/public/OurDoctors';
import DoctorDetails from './pages/public/DoctorDetails';
import PatientRegister from './pages/public/PatientRegister';
import Login from './pages/public/Login';
import NotFound from './pages/public/NotFound';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import AppointmentDetails from './pages/patient/AppointmentDetails';
import PatientProfile from './pages/patient/PatientProfile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import AddDoctor from './pages/admin/AddDoctor';
import EditDoctor from './pages/admin/EditDoctor';
import ManagePatients from './pages/admin/ManagePatients';
import ManageAppointments from './pages/admin/ManageAppointments';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* 1 - 8: Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/doctors" element={<OurDoctors />} />
              <Route path="/doctors/:id" element={<DoctorDetails />} />
              <Route path="/register" element={<PatientRegister />} />
              <Route path="/login" element={<Login />} />

              {/* Convenience redirect for top-level book-appointment */}
              <Route
                path="/book-appointment"
                element={
                  <ProtectedRoute allowedRoles={['patient', 'admin']}>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />

              {/* 9 - 13: Patient Protected Routes */}
              <Route
                path="/patient/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['patient', 'admin']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/book-appointment"
                element={
                  <ProtectedRoute allowedRoles={['patient', 'admin']}>
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/appointments"
                element={
                  <ProtectedRoute allowedRoles={['patient', 'admin']}>
                    <MyAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/appointments/:id"
                element={
                  <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
                    <AppointmentDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/profile"
                element={
                  <ProtectedRoute allowedRoles={['patient', 'admin']}>
                    <PatientProfile />
                  </ProtectedRoute>
                }
              />

              {/* 14 - 16: Doctor Protected Routes */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/appointments"
                element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                    <DoctorAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/profile"
                element={
                  <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                    <DoctorProfile />
                  </ProtectedRoute>
                }
              />

              {/* 17 - 22: Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/doctors"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageDoctors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/doctors/new"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AddDoctor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/doctors/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <EditDoctor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/patients"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManagePatients />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageAppointments />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
