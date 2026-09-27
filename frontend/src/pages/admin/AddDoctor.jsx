import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage';

const AddDoctor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department_id: '1',
    specialization: 'General Medicine',
    qualification: '',
    experience: '5',
    consultation_fee: '600',
    available_days: 'Monday - Saturday',
    available_timings: '09:00 AM - 01:00 PM',
    profile_image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500',
    description: '',
    is_active: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSpecializationChange = (e) => {
    const val = e.target.value;
    const deptMap = {
      'General Medicine': '1',
      'Cardiology': '2',
      'Dermatology': '3',
      'Pediatrics': '4',
      'Orthopedics': '5',
      'Neurology': '6',
      'ENT (Ear, Nose & Throat)': '7',
      'Gynecology & Obstetrics': '8'
    };
    setFormData({
      ...formData,
      specialization: val,
      department_id: deptMap[val] || '1'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.qualification) {
      setError('Please provide doctor name, email, and qualifications.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createDoctor(formData);
      if (res.success) {
        setSuccess('Doctor successfully registered in MySQL database! Redirecting...');
        setTimeout(() => {
          navigate('/admin/doctors');
        }, 1200);
      } else {
        setError(res.message || 'Failed to add doctor.');
      }
    } catch (err) {
      setError(err.message || 'Error creating doctor record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                  <h3 className="fw-bold mb-1">Add New Specialist Doctor</h3>
                  <small className="text-muted">Register consulting medical practitioner into the hospital roster.</small>
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
                      placeholder="e.g. Dr. Harish Mehta"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Doctor Official Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. harish.mehta@careconnect.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Medical Specialization *</label>
                    <select
                      className="form-select"
                      value={formData.specialization}
                      onChange={handleSpecializationChange}
                    >
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Neurology">Neurology</option>
                      <option value="ENT (Ear, Nose & Throat)">ENT (Ear, Nose & Throat)</option>
                      <option value="Gynecology & Obstetrics">Gynecology & Obstetrics</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Qualifications & Degrees *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. MBBS, MD, DM, FRCP"
                      required
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Clinical Experience (Years)</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Consultation Fee (₹ INR) *</label>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      className="form-control"
                      value={formData.consultation_fee}
                      onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Available Days</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Monday - Saturday"
                      value={formData.available_days}
                      onChange={(e) => setFormData({ ...formData, available_days: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">OPD Timings</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 09:00 AM - 01:00 PM"
                      value={formData.available_timings}
                      onChange={(e) => setFormData({ ...formData, available_timings: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Profile Photo URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.profile_image}
                      onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Doctor Bio / Profile Summary</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Brief overview of clinical expertise, special interests, and patient care philosophy..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold py-3" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving Doctor to MySQL...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save2-fill me-2"></i> Register Doctor
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

export default AddDoctor;
