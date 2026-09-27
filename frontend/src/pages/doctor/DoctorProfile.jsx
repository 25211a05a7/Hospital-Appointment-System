import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.getProfile();
        if (res.success && res.user) {
          setProfile(res.user);
        }
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const details = profile?.details || {};

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <div className="text-center mb-4 pb-3 border-bottom">
                <img
                  src={details.profile_image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400'}
                  alt={profile?.name}
                  className="rounded-circle object-fit-cover shadow mb-3"
                  style={{ width: 130, height: 130 }}
                />
                <h3 className="fw-bold mb-1">{profile?.name}</h3>
                <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill fw-bold">
                  {details.specialization || 'Medical Specialist'}
                </span>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Qualifications</span>
                    <strong className="text-dark">{details.qualification || 'MBBS, MD'}</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Clinical Experience</span>
                    <strong className="text-dark">{details.experience || 10} Years</strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">Consultation Fee</span>
                    <strong className="text-primary fs-5">
                      ₹{parseFloat(details.consultation_fee || 500).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block">OPD Timings</span>
                    <strong className="text-teal">{details.available_timings || '09:00 AM - 01:00 PM'}</strong>
                  </div>
                </div>

                <div className="col-12">
                  <div className="p-3 bg-light rounded-3">
                    <span className="text-muted small d-block mb-1">Consultant Biography</span>
                    <p className="small text-secondary mb-0">
                      {details.description || 'Senior consulting doctor providing comprehensive diagnostic and clinical therapeutic care at CareConnect Hospital.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
