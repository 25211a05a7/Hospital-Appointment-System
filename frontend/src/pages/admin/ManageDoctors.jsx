import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedDept !== 'all') params.department = selectedDept;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await api.getDoctors(params);
      if (res.success) {
        setDoctors(res.doctors || []);
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedDept, searchTerm]);

  const handleToggleActive = async (doctor) => {
    const nextStatus = doctor.is_active ? 0 : 1;
    try {
      const res = await api.updateDoctor(doctor.id, { is_active: nextStatus });
      if (res.success) {
        setMessage({
          type: 'success',
          text: `Dr. ${doctor.name} has been ${nextStatus ? 'activated' : 'deactivated'} successfully.`
        });
        fetchDoctors();
      } else {
        setMessage({ type: 'danger', text: res.message || 'Failed to update status.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error updating doctor status.' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete Dr. ${name}?`)) {
      return;
    }

    try {
      const res = await api.deleteDoctor(id, true);
      if (res.success) {
        setMessage({ type: 'success', text: `Dr. ${name} record deleted.` });
        fetchDoctors();
      } else {
        setMessage({ type: 'danger', text: res.message || 'Failed to delete.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error deleting doctor.' });
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Doctor Directory Management</h2>
            <p className="text-muted small mb-0">Register, edit, or adjust clinical schedules and consultation fees for medical staff.</p>
          </div>
          <Link to="/admin/doctors/new" className="btn btn-primary fw-bold px-4 py-2">
            <i className="bi bi-person-plus-fill me-2"></i> Add New Doctor
          </Link>
        </div>

        {message && (
          <AlertMessage
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        {/* Filter / Search */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
          <div className="row g-3">
            <div className="col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search doctor by name, qualification..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-5">
              <select
                className="form-select"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Neurology">Neurology</option>
                <option value="ENT (Ear, Nose & Throat)">ENT</option>
                <option value="Gynecology & Obstetrics">Gynecology</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="card border-0 shadow-sm rounded-4 p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-person-x fs-1 mb-2 d-block"></i>
              No doctor records found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Doctor Profile</th>
                    <th>Specialization</th>
                    <th>Experience & Fee</th>
                    <th>OPD Schedule</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={doc.profile_image}
                            alt={doc.name}
                            className="rounded-circle object-fit-cover"
                            style={{ width: 48, height: 48 }}
                          />
                          <div>
                            <div className="fw-bold text-dark">{doc.name}</div>
                            <small className="text-muted">{doc.qualification}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary-light text-primary">
                          {doc.specialization}
                        </span>
                      </td>
                      <td className="small">
                        <div>{doc.experience} Years Exp</div>
                        <strong className="text-primary">₹{parseFloat(doc.consultation_fee).toFixed(2)}</strong>
                      </td>
                      <td className="small">
                        <div>{doc.available_days}</div>
                        <span className="text-teal">{doc.available_timings}</span>
                      </td>
                      <td>
                        <span className={`badge ${doc.is_active ? 'bg-success' : 'bg-secondary'}`}>
                          {doc.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/admin/doctors/${doc.id}/edit`}
                            className="btn btn-outline-primary"
                            title="Edit Doctor"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Link>
                          <button
                            type="button"
                            className={`btn ${doc.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                            title={doc.is_active ? 'Deactivate Doctor' : 'Activate Doctor'}
                            onClick={() => handleToggleActive(doc)}
                          >
                            <i className={`bi ${doc.is_active ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            title="Delete Doctor"
                            onClick={() => handleDelete(doc.id, doc.name)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
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

export default ManageDoctors;
