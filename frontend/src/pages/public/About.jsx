import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="py-5">
      {/* Page Header */}
      <div className="container mb-5">
        <div className="text-center">
          <span className="text-primary fw-bold text-uppercase small">About CareConnect</span>
          <h1 className="display-5 fw-bold mt-1 mb-3">Excellence in Medical Care & Innovation</h1>
          <p className="text-muted mx-auto lead" style={{ maxWidth: '750px' }}>
            Serving the community with compassionate healthcare, advanced robotic diagnostics, and distinguished clinical practitioners since 2012.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container mb-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 p-4 border-0 shadow-sm border-top border-4 border-primary">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-primary-light text-primary p-3 rounded-circle fs-3">
                  <i className="bi bi-bullseye"></i>
                </div>
                <h4 className="fw-bold mb-0">Our Mission</h4>
              </div>
              <p className="text-muted">
                To provide accessible, high-quality, and empathetic healthcare services to every segment of society by leveraging state-of-the-art medical technology, ethical medical practices, and patient-centered clinical care.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 p-4 border-0 shadow-sm border-top border-4 border-teal">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-teal-light text-teal p-3 rounded-circle fs-3">
                  <i className="bi bi-eye"></i>
                </div>
                <h4 className="fw-bold mb-0">Our Vision</h4>
              </div>
              <p className="text-muted">
                To become India's foremost benchmark hospital network recognized for clinical breakthrough excellence, zero-error medical procedures, transparent outpatient scheduling, and compassionate healing environments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-light py-5 mb-5">
        <div className="container">
          <div className="text-center mb-4">
            <h3 className="fw-bold">Our Core Values</h3>
            <p className="text-muted">The foundational principles guiding every patient interaction.</p>
          </div>
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="p-3">
                <i className="bi bi-heart-pulse text-danger fs-1 mb-2"></i>
                <h5 className="fw-bold">Compassion</h5>
                <p className="small text-muted">Treating every patient with dignity, warmth, and human empathy.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <i className="bi bi-shield-check text-primary fs-1 mb-2"></i>
                <h5 className="fw-bold">Integrity</h5>
                <p className="small text-muted">Transparent consultations, ethical pricing, and complete medical honesty.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <i className="bi bi-stars text-warning fs-1 mb-2"></i>
                <h5 className="fw-bold">Excellence</h5>
                <p className="small text-muted">Continuous adoption of cutting-edge clinical protocols and research.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <i className="bi bi-people text-teal fs-1 mb-2"></i>
                <h5 className="fw-bold">Collaboration</h5>
                <p className="small text-muted">Multi-disciplinary teams working together for holistic recovery.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Infrastructure */}
      <div className="container mb-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h3 className="fw-bold mb-3">Modern Infrastructure & Patient Facilities</h3>
            <p className="text-muted mb-4">
              CareConnect features an expansive 400-bed multi-speciality campus designed to exceed international healthcare standards.
            </p>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-primary fs-5"></i>
                <span><strong>Advanced Diagnostics:</strong> 3T MRI, 128-Slice CT, Digital Cath Lab & 24/7 NABL Pathology.</span>
              </li>
              <li className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-primary fs-5"></i>
                <span><strong>Modular Operation Theatres:</strong> Class-100 laminar airflow OTs with robotic surgery support.</span>
              </li>
              <li className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-primary fs-5"></i>
                <span><strong>Emergency & Critical Care:</strong> Dedicated Trauma ICU, CCU, and PICU with 1:1 nurse-to-patient ratio.</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/doctors" className="btn btn-primary me-3">Explore Doctors</Link>
              <Link to="/contact" className="btn btn-outline-secondary">Get in Touch</Link>
            </div>
          </div>
          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=700&auto=format&fit=crop&q=80"
              alt="Hospital laboratory"
              className="img-fluid rounded-4 shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
