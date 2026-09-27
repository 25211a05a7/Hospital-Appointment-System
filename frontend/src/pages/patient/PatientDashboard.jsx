import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getDashboardStats();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load patient dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Welcome Header */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <span className="badge bg-primary-light text-primary mb-2 px-3 py-2 rounded-pill fw-bold">
                PATIENT MEDICAL PORTAL
              </span>
              <h2 className="fw-bold mb-1">Welcome back, {user?.name || 'Patient'}!</h2>
              <p className="text-muted mb-0 small">
                Manage your outpatient bookings, track scheduled consultations, and update personal medical records.
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/patient/book-appointment" className="btn btn-warning fw-bold px-4 py-2 shadow-sm">
                <i className="bi bi-calendar-plus me-2"></i> Book Appointment
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-icon bg-primary-light text-primary">
                <i className="bi bi-calendar-check-fill"></i>
              </div>
              <div>
                <div className="fs-3 fw-bold text-dark">{stats?.upcomingAppointments ?? 0}</div>
                <div className="text-muted small fw-semibold">Upcoming Visits</div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-icon bg-teal-light text-teal">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <div>
                <div className="fs-3 fw-bold text-dark">{stats?.completedAppointments ?? 0}</div>
                <div className="text-muted small fw-semibold">Completed Consultations</div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-icon bg-danger bg-opacity-10 text-danger">
                <i className="bi bi-x-circle-fill"></i>
              </div>
              <div>
                <div className="fs-3 fw-bold text-dark">{stats?.cancelledAppointments ?? 0}</div>
                <div className="text-muted small fw-semibold">Cancelled Visits</div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Scheduled Appointment Banner */}
        {stats?.nextAppointment && (
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-primary text-white">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold mb-2">
                  NEXT UPCOMING CONSULTATION
                </span>
                <h4 className="fw-bold mb-1">
                  Dr. {stats.nextAppointment.doctor_name} ({stats.nextAppointment.specialization})
                </h4>
                <div className="d-flex flex-wrap gap-3 mt-2 text-light opacity-90 small">
                  <div><i className="bi bi-calendar3 me-1"></i> Date: <strong>{stats.nextAppointment.appointment_date}</strong></div>
                  <div><i className="bi bi-clock me-1"></i> Time: <strong>{stats.nextAppointment.appointment_time}</strong></div>
                  <div><i className="bi bi-info-circle me-1"></i> Status: <strong>{stats.nextAppointment.status}</strong></div>
                </div>
              </div>
              <Link
                to={`/patient/appointments/${stats.nextAppointment.id}`}
                className="btn btn-light text-primary fw-bold px-4 py-2 text-nowrap"
              >
                View Appointment Voucher
              </Link>
            </div>
          </div>
        )}

        {/* Recent Appointments & Shortcuts */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Recent Appointments</h5>
                <Link to="/patient/appointments" className="btn btn-sm btn-link text-primary fw-semibold p-0">
                  View All <i className="bi bi-chevron-right"></i>
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
              ) : !stats?.recentAppointments || stats.recentAppointments.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-calendar-x fs-2 mb-2 d-block"></i>
                  No appointments booked yet.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Doctor</th>
                        <th>Specialty</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentAppointments.map((appt) => (
                        <tr key={appt.id}>
                          <td className="fw-semibold text-dark">{appt.doctor_name}</td>
                          <td className="text-muted small">{appt.specialization}</td>
                          <td className="small">
                            <div>{appt.appointment_date}</div>
                            <span className="text-muted">{appt.appointment_time}</span>
                          </td>
                          <td>
                            <span className={`badge badge-${appt.status.toLowerCase()}`}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <Link
                              to={`/patient/appointments/${appt.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-3">Quick Actions</h5>
              <div className="d-grid gap-2">
                <Link to="/doctors" className="btn btn-outline-primary text-start py-3 px-3 d-flex align-items-center gap-3">
                  <i className="bi bi-search fs-4 text-primary"></i>
                  <div>
                    <div className="fw-bold">Find a Doctor</div>
                    <small className="text-muted">Explore specialists across 8 departments</small>
                  </div>
                </Link>

                <Link to="/patient/book-appointment" className="btn btn-outline-success text-start py-3 px-3 d-flex align-items-center gap-3">
                  <i className="bi bi-calendar-plus fs-4 text-success"></i>
                  <div>
                    <div className="fw-bold">Book Appointment</div>
                    <small className="text-muted">Instant online OPD slot booking</small>
                  </div>
                </Link>

                <Link to="/patient/appointments" className="btn btn-outline-teal text-start py-3 px-3 d-flex align-items-center gap-3 border">
                  <i className="bi bi-clock-history fs-4 text-teal"></i>
                  <div>
                    <div className="fw-bold">My Appointments</div>
                    <small className="text-muted">Track upcoming and past visit history</small>
                  </div>
                </Link>

                <Link to="/patient/profile" className="btn btn-outline-secondary text-start py-3 px-3 d-flex align-items-center gap-3">
                  <i className="bi bi-person-gear fs-4 text-secondary"></i>
                  <div>
                    <div className="fw-bold">Edit Profile</div>
                    <small className="text-muted">Update contact and medical info</small>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
