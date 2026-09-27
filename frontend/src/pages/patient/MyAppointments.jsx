import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.getMyAppointments();
      if (res.success) {
        setAppointments(res.appointments || []);
      }
    } catch (err) {
      console.error('Failed to load patient appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled appointment?')) {
      return;
    }

    try {
      const res = await api.cancelAppointment(id);
      if (res.success) {
        setMessage({ type: 'success', text: 'Appointment cancelled successfully.' });
        fetchAppointments();
      } else {
        setMessage({ type: 'danger', text: res.message || 'Failed to cancel appointment.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error cancelling appointment.' });
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus = statusFilter === 'ALL' || appt.status.toUpperCase() === statusFilter;
    const matchesSearch =
      !searchTerm ||
      appt.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">My Medical Appointments</h2>
            <p className="text-muted small mb-0">View, track, or cancel your hospital outpatient appointments.</p>
          </div>
          <Link to="/patient/book-appointment" className="btn btn-warning fw-bold px-4 py-2 shadow-sm">
            <i className="bi bi-calendar-plus me-2"></i> Book New Appointment
          </Link>
        </div>

        {message && (
          <AlertMessage
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        {/* Filters and Search Bar */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="btn-group w-100" role="group">
                {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`btn btn-sm ${
                      statusFilter === tab ? 'btn-primary fw-bold' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setStatusFilter(tab)}
                  >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by doctor, specialty, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
            <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
            <h4 className="fw-bold">No Appointments Found</h4>
            <p className="text-muted mb-4">You have no appointments matching the selected filters.</p>
            <Link to="/patient/book-appointment" className="btn btn-primary mx-auto">
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {filteredAppointments.map((appt) => (
              <div key={appt.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 h-100 d-flex flex-column p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className={`badge badge-${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                    <span className="text-muted small">ID: #{appt.id}</span>
                  </div>

                  <div className="d-flex align-items-center gap-3 mb-3">
                    <img
                      src={appt.doctor_image}
                      alt={appt.doctor_name}
                      className="rounded-circle object-fit-cover shadow-sm"
                      style={{ width: 60, height: 60 }}
                    />
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">{appt.doctor_name}</h5>
                      <span className="text-primary small fw-semibold">{appt.doctor_specialization}</span>
                    </div>
                  </div>

                  <div className="bg-light p-3 rounded-3 small mb-3 flex-grow-1">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted"><i className="bi bi-calendar-event me-1"></i> Date:</span>
                      <span className="fw-semibold text-dark">{appt.appointment_date}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted"><i className="bi bi-clock me-1"></i> Time:</span>
                      <span className="fw-semibold text-teal">{appt.appointment_time}</span>
                    </div>
                    <div className="d-flex justify-content-between pt-2 border-top">
                      <span className="text-muted">Fee:</span>
                      <span className="fw-bold text-dark">₹{parseFloat(appt.consultation_fee).toFixed(2)}</span>
                    </div>
                    <div className="mt-2 pt-2 border-top text-muted">
                      <strong>Reason:</strong> {appt.reason}
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-auto">
                    <Link
                      to={`/patient/appointments/${appt.id}`}
                      className="btn btn-outline-primary btn-sm flex-grow-1"
                    >
                      <i className="bi bi-receipt me-1"></i> View Slip
                    </Link>

                    {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleCancel(appt.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
