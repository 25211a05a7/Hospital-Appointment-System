import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/">
          <i className="bi bi-hospital text-primary fs-3"></i>
          <span>CareConnect <span className="text-teal fs-6 fw-normal">Hospital</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">
                <i className="bi bi-house-door me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/about">
                <i className="bi bi-info-circle me-1"></i> About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/doctors">
                <i className="bi bi-person-badge me-1"></i> Our Doctors
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/contact">
                <i className="bi bi-telephone me-1"></i> Contact
              </NavLink>
            </li>
          </ul>

          {/* Right Action buttons / User Menu */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span className="fw-semibold">{user?.name || 'My Account'}</span>
                  <span className="badge bg-primary text-uppercase" style={{ fontSize: '0.65rem' }}>
                    {user?.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="userDropdown">
                  {user?.role === 'patient' && (
                    <>
                      <li>
                        <Link className="dropdown-item py-2" to="/patient/dashboard">
                          <i className="bi bi-speedometer2 me-2 text-primary"></i> Patient Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/patient/book-appointment">
                          <i className="bi bi-calendar-plus me-2 text-teal"></i> Book Appointment
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/patient/appointments">
                          <i className="bi bi-calendar-check me-2 text-primary"></i> My Appointments
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/patient/profile">
                          <i className="bi bi-person-gear me-2 text-secondary"></i> My Profile
                        </Link>
                      </li>
                    </>
                  )}

                  {user?.role === 'doctor' && (
                    <>
                      <li>
                        <Link className="dropdown-item py-2" to="/doctor/dashboard">
                          <i className="bi bi-speedometer2 me-2 text-primary"></i> Doctor Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/doctor/appointments">
                          <i className="bi bi-calendar3 me-2 text-primary"></i> Doctor Appointments
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/doctor/profile">
                          <i className="bi bi-person-lines-fill me-2 text-secondary"></i> Doctor Profile
                        </Link>
                      </li>
                    </>
                  )}

                  {user?.role === 'admin' && (
                    <>
                      <li>
                        <Link className="dropdown-item py-2" to="/admin/dashboard">
                          <i className="bi bi-speedometer2 me-2 text-primary"></i> Admin Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/admin/doctors">
                          <i className="bi bi-people me-2 text-primary"></i> Manage Doctors
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/admin/patients">
                          <i className="bi bi-person-vcard me-2 text-info"></i> Manage Patients
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/admin/appointments">
                          <i className="bi bi-calendar2-range me-2 text-success"></i> Manage Appointments
                        </Link>
                      </li>
                    </>
                  )}

                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm px-3">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link to="/register" className="btn btn-teal btn-sm px-3">
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
