import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AlertMessage from '../../components/AlertMessage';

const PatientRegister = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'Male',
    address: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validations
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all mandatory required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please provide a valid email address.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Phone number must contain at least 10 digits.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData);
      if (res.success) {
        setSuccess('Registration successful! Redirecting to your patient dashboard...');
        setTimeout(() => {
          navigate('/patient/dashboard');
        }, 1200);
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary-light text-primary rounded-circle p-3 mb-2">
                  <i className="bi bi-person-plus-fill fs-2"></i>
                </div>
                <h2 className="fw-bold">Patient Registration</h2>
                <p className="text-muted small">
                  Create your CareConnect health account to book appointments and manage medical consultations.
                </p>
              </div>

              {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
              {success && <AlertMessage type="success" message={success} />}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Full Name */}
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. rahul@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number (10 Digits) *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. 9876543210"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  {/* Password */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Password (Min 6 Chars) *</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Confirm Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>

                  {/* Gender */}
                  <div className="col-md-6">
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

                  {/* Residential Address */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">Residential Address</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      placeholder="Enter your street address, city, pin code..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-teal btn-lg w-100 fw-bold py-3 shadow-sm" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-check-fill me-2"></i> Register Account
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <div className="text-center mt-4 text-muted small">
                Already have an account? <Link to="/login" className="text-primary fw-bold">Sign In here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;
