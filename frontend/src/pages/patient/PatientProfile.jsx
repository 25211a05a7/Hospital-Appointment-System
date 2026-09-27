import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage';

const PatientProfile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: '',
    address: '',
    emergencyContact: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.getProfile();
        if (res.success && res.user) {
          const u = res.user;
          const d = u.details || {};
          setFormData({
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            dateOfBirth: d.date_of_birth || '',
            gender: d.gender || 'Male',
            bloodGroup: d.blood_group || '',
            address: d.address || '',
            emergencyContact: d.emergency_contact || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await api.updateProfile(formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        updateUser({ name: formData.name, phone: formData.phone });
      } else {
        setMessage({ type: 'danger', text: res.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error updating profile.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div className="bg-primary-light text-primary rounded-circle p-3 fs-3">
                  <i className="bi bi-person-badge-fill"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">Patient Medical Profile</h3>
                  <small className="text-muted">Manage your personal details and emergency contact records.</small>
                </div>
              </div>

              {message && (
                <AlertMessage
                  type={message.type}
                  message={message.text}
                  onClose={() => setMessage(null)}
                />
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address (Account ID)</label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      value={formData.email}
                      disabled
                    />
                    <small className="text-muted">Email is permanent and cannot be modified.</small>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Contact Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Kin / Family phone number"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Gender</label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Blood Group</label>
                    <select
                      className="form-select"
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Residential Address</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Enter street address, city, state, pin code..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-teal btn-lg w-100 fw-bold py-3 shadow-sm" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save2-fill me-2"></i> Update Medical Profile
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

export default PatientProfile;
