import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage';

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: 'General Medicine',
    qualification: '',
    experience: '',
    consultation_fee: '',
    available_days: '',
    available_timings: '',
    profile_image: '',
    description: '',
    is_active: 1
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await api.getDoctorById(id);
        if (res.success && res.doctor) {
          const d = res.doctor;
          setFormData({
            name: d.name || '',
            email: d.email || '',
            specialization: d.specialization || 'General Medicine',
            qualification: d.qualification || '',
            experience: d.experience || '1',
            consultation_fee: d.consultation_fee || '500',
            available_days: d.available_days || '',
            available_timings: d.available_timings || '',
            profile_image: d.profile_image || '',
            description: d.description || '',
            is_active: d.is_active ? 1 : 0
          });
        } else {
          setError(res.message || 'Doctor not found.');
        }
      } catch (err) {
        setError(err.message || 'Error fetching doctor.');
      } finally {
        setFetching(false);
      }
    };

    fetchDoc();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.updateDoctor(id, formData);
      if (res.success) {
        setSuccess('Doctor details updated successfully! Redirecting...');
        setTimeout(() => {
          navigate('/admin/doctors');
        }, 1200);
      } else {
        setError(res.message || 'Failed to update doctor.');
      }
    } catch (err) {
      setError(err.message || 'Error updating doctor.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading doctor record...</p>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                  <h3 className="fw-bold mb-1">Edit Doctor Details</h3>
                  <small className="text-muted">Update clinical qualifications, schedule, and active status.</small>
                </div>
                <Link to="/admin/doctors" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-arrow-left me-1"></i> Back
                </Link>
              </div>

              {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
              {success && <AlertMessage type="success" message={success} />}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Doctor Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Official Email</label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      disabled
                      value={formData.email}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Medical Specialization</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Qualifications & Degrees</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Experience (Years)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.consultation_fee}
                      onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Active Status</label>
                    <select
                      className="form-select"
                      value={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value, 10) })}
                    >
                      <option value="1">Active</option>
                      <option value="0">Deactivated</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Available Days</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.available_days}
                      onChange={(e) => setFormData({ ...formData, available_days: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">OPD Timings</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.available_timings}
                      onChange={(e) => setFormData({ ...formData, available_timings: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Profile Photo URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.profile_image}
                      onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Doctor Bio / Profile Summary</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold py-3" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i> Update Doctor Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDoctor;
