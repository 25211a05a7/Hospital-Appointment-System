import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const res = await api.updateAppointmentStatus(appointmentId, newStatus);
      if (res.success) {
        setMessage({ type: 'success', text: `Appointment status updated to '${newStatus}'.` });
        fetchDashboard();
      } else {
        setMessage({ type: 'danger', text: res.message || 'Failed to update status.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error updating status.' });
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Welcome Header */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <span className="badge bg-teal-light text-teal mb-2 px-3 py-2 rounded-pill fw-bold">
                DOCTOR CLINICAL CONSOLE
              </span>
              <h2 className="fw-bold mb-1">{user?.name || 'Doctor'}</h2>
              <p className="text-muted mb-0 small">
                Consultant Physician & Surgeon Portal — Manage your OPD queue and patient consultations.
              </p>
            </div>
            <Link to="/doctor/appointments" className="btn btn-primary fw-bold px-4 py-2">
              <i className="bi bi-calendar3 me-2"></i> View All Appointments
            </Link>
          </div>
        </div>

        {message && (
          <AlertMessage
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        {/* Metric Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-icon bg-warning bg-opacity-20 text-warning">
                <i className="bi bi-calendar-day-fill"></i>
              </div>
              <div>
                <div className="fs-3 fw-bold text-dark">{stats?.todayAppointments ?? 0}</div>
                <div className="text-muted small fw-semibold">Today's Scheduled OPD</div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-icon bg-primary-light text-primary">
                <i className="bi bi-clock-history"></i>
              </div>
              <div>
                <div className="fs-3 fw-bold text-dark">{stats?.upcomingAppointments ?? 0}</div>
                <div className="text-muted small fw-semibold">Upcoming Consultations</div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-icon bg-teal-light text-teal">
                <i className="bi bi-check2-all"></i>
              </div>
              <div>
                <div className="fs-3 fw-bold text-dark">{stats?.completedAppointments ?? 0}</div>
                <div className="text-muted small fw-semibold">Completed Patients</div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Consultation Queue */}
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Assigned Patient Queue & Appointments</h5>
            <Link to="/doctor/appointments" className="btn btn-sm btn-link text-primary fw-semibold p-0">
              Full List <i className="bi bi-chevron-right"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : !stats?.recentAppointments || stats.recentAppointments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-person-check fs-1 mb-2 d-block"></i>
              No pending patient appointments scheduled.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Patient Name</th>
                    <th>Contact</th>
                    <th>Schedule</th>
                    <th>Clinical Reason</th>
                    <th>Status</th>
                    <th className="text-end">Manage Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAppointments.map((appt) => (
                    <tr key={appt.id}>
                      <td>
                        <div className="fw-bold text-dark">{appt.patient_name}</div>
                        <small className="text-muted">
                          {appt.patient_gender || 'Male'} • Blood: {appt.patient_blood_group || 'N/A'}
                        </small>
                      </td>
                      <td className="small">
                        <div><i className="bi bi-telephone me-1 text-muted"></i>{appt.patient_phone}</div>
                        <div className="text-muted"><i className="bi bi-envelope me-1"></i>{appt.patient_email}</div>
                      </td>
                      <td className="small">
                        <div className="fw-semibold">{appt.appointment_date}</div>
                        <span className="text-teal fw-bold">{appt.appointment_time}</span>
                      </td>
                      <td className="small text-muted" style={{ maxWidth: 220 }}>
                        {appt.reason}
                      </td>
                      <td>
                        <span className={`badge badge-${appt.status.toLowerCase()}`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          {appt.status !== 'Confirmed' && appt.status !== 'Completed' && (
                            <button
                              className="btn btn-outline-primary"
                              title="Confirm Appointment"
                              onClick={() => handleStatusChange(appt.id, 'Confirmed')}
                            >
                              Confirm
                            </button>
                          )}
                          {appt.status !== 'Completed' && (
                            <button
                              className="btn btn-outline-success"
                              title="Mark Completed"
                              onClick={() => handleStatusChange(appt.id, 'Completed')}
                            >
                              Complete
                            </button>
                          )}
                          {appt.status !== 'Cancelled' && (
                            <button
                              className="btn btn-outline-danger"
                              title="Cancel"
                              onClick={() => handleStatusChange(appt.id, 'Cancelled')}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
