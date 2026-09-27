import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.getDoctorById(id);
        if (res.success) {
          setDoctor(res.doctor);
        } else {
          setError(res.message || 'Doctor details not found.');
        }
      } catch (err) {
        setError(err.message || 'Error fetching doctor profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading doctor details...</span>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 p-5 shadow-sm rounded-4 max-w-lg mx-auto">
          <i className="bi bi-exclamation-triangle fs-1 text-danger mb-3"></i>
          <h3>Doctor Profile Not Found</h3>
          <p className="text-muted">{error || 'The requested doctor does not exist or has been deactivated.'}</p>
          <Link to="/doctors" className="btn btn-primary mt-3 mx-auto">
            Back to Doctors Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Breadcrumb navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/doctors">Doctors</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{doctor.name}</li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* Left Column: Doctor Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden text-center p-4">
              <div className="mx-auto mb-3" style={{ width: 180, height: 180 }}>
                <img
                  src={doctor.profile_image}
                  alt={doctor.name}
                  className="w-100 h-100 rounded-circle object-fit-cover shadow"
                />
              </div>
              <h3 className="fw-bold mb-1">{doctor.name}</h3>
              <p className="text-primary fw-semibold mb-2">{doctor.specialization}</p>
              <span className="badge bg-primary-light text-primary py-2 px-3 rounded-pill mx-auto mb-3">
                {doctor.department_name || doctor.specialization}
              </span>

              <hr className="my-3" />

              <div className="text-start small">
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Experience:</span>
                  <span className="fw-bold">{doctor.experience} Years</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Consultation Fee:</span>
                  <span className="fw-bold text-primary fs-6">₹{parseFloat(doctor.consultation_fee).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Available Days:</span>
                  <span className="fw-bold text-end">{doctor.available_days}</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted">Timings:</span>
                  <span className="fw-bold text-end text-teal">{doctor.available_timings}</span>
                </div>
              </div>

              <div className="mt-4 d-grid">
                <Link
                  to={`/patient/book-appointment?doctorId=${doctor.id}`}
                  className="btn btn-warning btn-lg fw-bold py-3 shadow-sm"
                >
                  <i className="bi bi-calendar-check-fill me-2"></i> Book Appointment Now
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Bio & Qualifications */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <h4 className="fw-bold text-dark mb-3">Medical Qualifications & Degrees</h4>
              <p className="lead fs-6 text-secondary bg-light p-3 rounded-3 border-start border-4 border-primary">
                {doctor.qualification}
              </p>

              <h4 className="fw-bold text-dark mt-4 mb-3">Professional Biography & Expertise</h4>
              <p className="text-muted" style={{ lineHeight: '1.8' }}>
                {doctor.description ||
                  `Dr. ${doctor.name} is a renowned specialist in ${doctor.specialization} at CareConnect Hospital with over ${doctor.experience} years of clinical expertise. Dr. ${doctor.name} has performed numerous diagnostic evaluations and clinical procedures, emphasizing preventative care, patient comfort, and evidence-based medical outcomes.`}
              </p>

              <h4 className="fw-bold text-dark mt-4 mb-3">Consultation Schedule & Booking Details</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="d-flex align-items-center gap-2 text-primary fw-bold mb-1">
                      <i className="bi bi-calendar-week fs-5"></i>
                      <span>Consultation Days</span>
                    </div>
                    <p className="mb-0 text-muted small">{doctor.available_days}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="d-flex align-items-center gap-2 text-teal fw-bold mb-1">
                      <i className="bi bi-clock-history fs-5"></i>
                      <span>OPD Slot Timings</span>
                    </div>
                    <p className="mb-0 text-muted small">{doctor.available_timings}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-4 bg-teal-light rounded-4 border border-teal d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                <div>
                  <h5 className="fw-bold text-teal mb-1">Ready for a Consultation?</h5>
                  <p className="small text-muted mb-0">Select your preferred date and time to reserve your OPD token.</p>
                </div>
                <Link
                  to={`/patient/book-appointment?doctorId=${doctor.id}`}
                  className="btn btn-teal fw-bold px-4 py-2 text-nowrap"
                >
                  Schedule Visit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
