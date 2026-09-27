import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4">
          {/* Col 1: About & Branding */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-hospital text-info"></i> CareConnect Hospital
            </h5>
            <p className="text-secondary small">
              Delivering patient-centric healthcare excellence with state-of-the-art diagnostic facilities, certified specialists, and seamless 24/7 appointment scheduling.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#social" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: 36, height: 36 }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#social" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: 36, height: 36 }}>
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#social" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: 36, height: 36 }}>
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#social" className="btn btn-sm btn-outline-light rounded-circle" style={{ width: 36, height: 36 }}>
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/" className="text-secondary hover-white">Home</Link></li>
              <li className="mb-2"><Link to="/about" className="text-secondary hover-white">About Hospital</Link></li>
              <li className="mb-2"><Link to="/doctors" className="text-secondary hover-white">Our Specialists</Link></li>
              <li className="mb-2"><Link to="/patient/book-appointment" className="text-secondary hover-white">Book Appointment</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-secondary hover-white">Emergency & Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Medical Specialties */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Specialties</h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2">General Medicine & Diagnostics</li>
              <li className="mb-2">Interventional Cardiology</li>
              <li className="mb-2">Clinical Dermatology & Cosmetology</li>
              <li className="mb-2">Pediatrics & Neonatal ICU</li>
              <li className="mb-2">Orthopedics & Joint Replacement</li>
              <li className="mb-2">Neurology & Neuro Surgery</li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Emergency & Contact</h6>
            <div className="small text-secondary mb-2">
              <i className="bi bi-geo-alt text-danger me-2"></i> CareConnect Central Campus, 100 Ft Road, Bangalore - 560038
            </div>
            <div className="small text-secondary mb-2">
              <i className="bi bi-telephone-outbound text-success me-2"></i> 24/7 Helpline: +91 (80) 2345-6789
            </div>
            <div className="small text-secondary mb-2">
              <i className="bi bi-envelope text-info me-2"></i> appointments@careconnect.com
            </div>
            <div className="mt-3 p-2 bg-secondary bg-opacity-25 rounded small text-warning">
              <i className="bi bi-shield-check me-1"></i> NABH & JCI Accredited Hospital
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start small text-secondary">
            © 2026 CareConnect Hospital. All Rights Reserved. (NRD Lab Project - Batch B9)
          </div>
          <div className="col-md-6 text-center text-md-end small text-secondary mt-2 mt-md-0">
            <span>Quality Healthcare, Simplified.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
