import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage';

const DoctorAppointments = () => {
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
      console.error('Failed to load doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.updateAppointmentStatus(id, status);
      if (res.success) {
        setMessage({ type: 'success', text: `Appointment #${id} status updated to '${status}'.` });
        fetchAppointments();
      } else {
        setMessage({ type: 'danger', text: res.message || 'Status update failed.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error updating status.' });
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus = statusFilter === 'ALL' || appt.status.toUpperCase() === statusFilter;
    const matchesSearch =
      !searchTerm ||
      appt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.appointment_date.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Doctor's Appointment Console</h2>
          <p className="text-muted small mb-0">Review all assigned patient appointments, update clinical status, or manage schedules.</p>
        </div>

        {message && (
          <AlertMessage
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        {/* Filters */}
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
                  placeholder="Search by patient name, date (YYYY-MM-DD), or reason..."
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
              No appointments found matching your filter criteria.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Token #</th>
                    <th>Patient Details</th>
                    <th>Date & Time</th>
                    <th>Reason / Symptoms</th>
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
                        <div className="small text-muted">
                          {appt.patient_gender || 'Male'} • Phone: {appt.patient_phone}
                        </div>
                      </td>
                      <td className="small">
                        <div className="fw-semibold text-dark">{appt.appointment_date}</div>
                        <span className="text-teal fw-bold">{appt.appointment_time}</span>
                      </td>
                      <td className="small text-muted" style={{ maxWidth: 260 }}>
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
                              onClick={() => handleStatusChange(appt.id, 'Confirmed')}
                            >
                              Confirm
                            </button>
                          )}
                          {appt.status !== 'Completed' && (
                            <button
                              className="btn btn-outline-success"
                              onClick={() => handleStatusChange(appt.id, 'Completed')}
                            >
                              Complete
                            </button>
                          )}
                          {appt.status !== 'Cancelled' && (
                            <button
                              className="btn btn-outline-danger"
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

export default DoctorAppointments;
