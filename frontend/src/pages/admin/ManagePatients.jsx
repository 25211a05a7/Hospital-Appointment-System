import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.getPatients({ search: searchTerm });
      if (res.success) {
        setPatients(res.patients || []);
      }
    } catch (err) {
      console.error('Failed to load patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchTerm]);

  const viewPatientDetails = async (id) => {
    try {
      const res = await api.getPatientById(id);
      if (res.success && res.patient) {
        setSelectedPatient(res.patient);
      }
    } catch (err) {
      console.error('Error fetching patient details:', err);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Registered Patients Directory</h2>
            <p className="text-muted small mb-0">Inspect hospital patient registrations, clinical contact profiles, and appointment history.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search patient by name, email, or contact phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Patients Table */}
        <div className="card border-0 shadow-sm rounded-4 p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-person-x fs-1 mb-2 d-block"></i>
              No patient records found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Patient ID</th>
                    <th>Full Name</th>
                    <th>Contact Phone</th>
                    <th>Email Address</th>
                    <th>Gender & Blood</th>
                    <th>Total Visits</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((pat) => (
                    <tr key={pat.id}>
                      <td className="fw-bold text-muted">#P{pat.id}</td>
                      <td className="fw-bold text-dark">{pat.name}</td>
                      <td>{pat.phone}</td>
                      <td className="text-muted small">{pat.email}</td>
                      <td>
                        <span className="badge bg-light text-dark border me-1">{pat.gender || 'Male'}</span>
                        <span className="badge bg-danger bg-opacity-10 text-danger">{pat.blood_group || 'N/A'}</span>
                      </td>
                      <td>
                        <span className="badge bg-primary rounded-pill px-3 py-1">
                          {pat.total_appointments} Bookings
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => viewPatientDetails(pat.id)}
                        >
                          <i className="bi bi-file-earmark-medical me-1"></i> Medical Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Patient Medical History Modal */}
        {selectedPatient && (
          <div className="modal show d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-person-vcard text-primary me-2"></i>
                    Patient File: {selectedPatient.name} (ID #{selectedPatient.id})
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedPatient(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded-3">
                        <small className="text-muted d-block">Phone & Email</small>
                        <strong>{selectedPatient.phone}</strong>
                        <div className="text-muted small">{selectedPatient.email}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded-3">
                        <small className="text-muted d-block">Date of Birth & Blood Group</small>
                        <strong>{selectedPatient.date_of_birth || 'Not Specified'}</strong>
                        <span className="badge bg-danger ms-2">{selectedPatient.blood_group || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="p-3 bg-light rounded-3">
                        <small className="text-muted d-block">Residential Address</small>
                        <div>{selectedPatient.address || 'No residential address on file.'}</div>
                      </div>
                    </div>
                  </div>

                  <h6 className="fw-bold mb-3 border-bottom pb-2">Consultation & Appointment History</h6>
                  {!selectedPatient.appointments || selectedPatient.appointments.length === 0 ? (
                    <p className="text-muted small">No past appointments recorded for this patient.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered align-middle small">
                        <thead className="table-light">
                          <tr>
                            <th>Date & Time</th>
                            <th>Doctor</th>
                            <th>Specialty</th>
                            <th>Reason</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPatient.appointments.map((a) => (
                            <tr key={a.id}>
                              <td>{a.appointment_date} {a.appointment_time}</td>
                              <td className="fw-semibold">{a.doctor_name}</td>
                              <td className="text-muted">{a.specialization}</td>
                              <td>{a.reason}</td>
                              <td>
                                <span className={`badge badge-${a.status.toLowerCase()}`}>
                                  {a.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedPatient(null)}
                  >
                    Close Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePatients;
