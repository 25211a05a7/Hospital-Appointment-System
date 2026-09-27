import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.getAllAppointments();
      if (res.success) {
        setAppointments(res.appointments || []);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await api.updateAppointmentStatus(id, newStatus);
      if (res.success) {
        setMessage({ type: 'success', text: `Appointment #${id} updated to '${newStatus}'.` });
        fetchAppointments();
      } else {
        setMessage({ type: 'danger', text: res.message || 'Update failed.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error updating appointment status.' });
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus = statusFilter === 'ALL' || appt.status.toUpperCase() === statusFilter;
    const matchesSearch =
      !searchTerm ||
      appt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.appointment_date.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Hospital Appointments Master Roster</h2>
            <p className="text-muted small mb-0">Global overview and schedule management for all consulting departments.</p>
          </div>
        </div>

        {message && (
          <AlertMessage
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        {/* Filter and Search Bar */}
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
                  placeholder="Search by patient, doctor, date (YYYY-MM-DD), or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="card border-0 shadow-sm rounded-4 p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar2-x fs-1 mb-2 d-block"></i>
              No appointments matching criteria.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Token</th>
                    <th>Patient Name</th>
                    <th>Doctor</th>
                    <th>Schedule</th>
                    <th>Consultation Reason</th>
                    <th>Status</th>
                    <th className="text-end">Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appt) => (
                    <tr key={appt.id}>
                      <td className="fw-bold text-muted">#{appt.id}</td>
                      <td>
                        <div className="fw-bold text-dark">{appt.patient_name}</div>
                        <small className="text-muted">Ph: {appt.patient_phone}</small>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{appt.doctor_name}</div>
                        <small className="text-primary">{appt.doctor_specialization}</small>
                      </td>
                      <td className="small">
                        <div>{appt.appointment_date}</div>
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
                              onClick={() => handleStatusUpdate(appt.id, 'Confirmed')}
                            >
                              Confirm
                            </button>
                          )}
                          {appt.status !== 'Completed' && (
                            <button
                              className="btn btn-outline-success"
                              onClick={() => handleStatusUpdate(appt.id, 'Completed')}
                            >
                              Complete
                            </button>
                          )}
                          {appt.status !== 'Cancelled' && (
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleStatusUpdate(appt.id, 'Cancelled')}
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

export default ManageAppointments;
