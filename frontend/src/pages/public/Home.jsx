import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Home = () => {
  const [departments, setDepartments] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.getDepartments(),
          api.getDoctors({ active: 'true' })
        ]);

        if (deptRes.success) setDepartments(deptRes.departments || []);
        if (docRes.success) setFeaturedDoctors((docRes.doctors || []).slice(0, 4));
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="hero-badge">
                <i className="bi bi-shield-fill-check text-warning"></i>
                NABH Accredited Multi-Speciality Hospital
              </div>
              <h1 className="hero-title">
                Your Health, Our Priority. <br />
                <span className="text-warning">Expert Medical Care</span> You Can Trust.
              </h1>
              <p className="hero-subtitle">
                CareConnect Hospital brings together India's top medical specialists, advanced diagnostics, and intuitive appointment booking to simplify your healthcare journey.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/patient/book-appointment" className="btn btn-warning btn-lg fw-bold px-4 py-3 shadow">
                  <i className="bi bi-calendar-check me-2"></i> Book Appointment
                </Link>
                <Link to="/doctors" className="btn btn-outline-light btn-lg fw-bold px-4 py-3">
                  <i className="bi bi-search me-2"></i> Find Doctor
                </Link>
              </div>

              {/* Emergency Banner */}
              <div className="mt-4 pt-3 border-top border-light border-opacity-25 d-flex align-items-center gap-3">
                <div className="bg-danger text-white rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <i className="bi bi-telephone-fill fs-5"></i>
                </div>
                <div>
                  <div className="text-light small text-uppercase fw-semibold">24/7 Emergency Casualty</div>
                  <div className="fs-5 fw-bold text-white">+91 (80) 2345-6789</div>
                </div>
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block text-center">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&auto=format&fit=crop&q=80"
                  alt="Doctor consultation"
                  className="img-fluid rounded-4 shadow-lg border border-4 border-white"
                  style={{ maxHeight: '440px', objectFit: 'cover' }}
                />
                <div
                  className="position-absolute bottom-0 start-0 bg-white text-dark p-3 rounded-3 shadow-lg m-3 text-start"
                  style={{ maxWidth: '220px' }}
                >
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className="bi bi-star-fill text-warning"></i>
                    <span className="fw-bold">4.9 / 5.0 Rating</span>
                  </div>
                  <small className="text-muted">Over 15,000+ verified patient reviews</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="py-4 bg-white border-bottom shadow-sm">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="fs-2 fw-extrabold text-primary">50,000+</div>
              <div className="text-muted small fw-semibold">Patients Treated</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="fs-2 fw-extrabold text-teal">8+</div>
              <div className="text-muted small fw-semibold">Specialized Departments</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="fs-2 fw-extrabold text-primary">24 / 7</div>
              <div className="text-muted small fw-semibold">Emergency Support</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="fs-2 fw-extrabold text-teal">99.8%</div>
              <div className="text-muted small fw-semibold">Positive Feedback</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT HOSPITAL INTRODUCTION */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=700&auto=format&fit=crop&q=80"
                alt="Hospital campus"
                className="img-fluid rounded-4 shadow"
              />
            </div>
            <div className="col-lg-6">
              <span className="text-teal fw-bold text-uppercase small tracking-wide">Welcome to CareConnect</span>
              <h2 className="display-6 fw-bold mt-2 mb-3">Redefining Compassionate Healthcare Excellence</h2>
              <p className="text-muted">
                Established as a center of medical distinction, CareConnect Hospital is committed to delivering world-class clinical care, cutting-edge surgical technology, and compassionate patient rehabilitation.
              </p>
              <div className="row g-3 mt-2">
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-teal fs-5 mt-1"></i>
                    <div>
                      <h6 className="fw-bold mb-1">Board Certified Specialists</h6>
                      <small className="text-muted">Experienced doctors across all major medical faculties.</small>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-teal fs-5 mt-1"></i>
                    <div>
                      <h6 className="fw-bold mb-1">Instant Slot Scheduling</h6>
                      <small className="text-muted">Real-time availability with no waiting queues.</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/about" className="btn btn-outline-primary">
                  Learn More About Us <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEDICAL DEPARTMENTS */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase small">Center of Excellence</span>
            <h2 className="fw-bold mt-1">Our Medical Specialties</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Comprehensive clinical specialties equipped with modern diagnostic facilities and experienced specialists.
            </p>
          </div>

          <div className="row g-4">
            {departments.map((dept) => (
              <div key={dept.id} className="col-md-6 col-lg-3">
                <div className="department-card">
                  <div className="department-icon">
                    <i className={`bi ${dept.icon || 'bi-heart-pulse'}`}></i>
                  </div>
                  <h5 className="fw-bold mb-2">{dept.name}</h5>
                  <p className="text-muted small mb-3">{dept.description}</p>
                  <Link to={`/doctors?department=${encodeURIComponent(dept.name)}`} className="btn btn-sm btn-link text-primary fw-semibold p-0">
                    View Specialists <i className="bi bi-chevron-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED DOCTORS */}
      <section className="py-5">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <span className="text-teal fw-bold text-uppercase small">Certified Doctors</span>
              <h2 className="fw-bold mt-1">Meet Our Leading Specialists</h2>
            </div>
            <Link to="/doctors" className="btn btn-outline-primary">
              View All Doctors <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <div className="row g-4">
            {featuredDoctors.map((doc) => (
              <div key={doc.id} className="col-md-6 col-lg-3">
                <div className="doctor-card">
                  <div className="doctor-img-wrapper">
                    <img src={doc.profile_image} alt={doc.name} />
                    <span className="doctor-badge-dept">{doc.specialization}</span>
                  </div>
                  <div className="p-3 d-flex flex-column flex-grow-1">
                    <h5 className="fw-bold mb-1">{doc.name}</h5>
                    <small className="text-muted mb-2">{doc.qualification}</small>
                    <div className="small text-secondary mb-3">
                      <i className="bi bi-briefcase me-1 text-primary"></i> {doc.experience} Years Experience
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3 pt-2 border-top">
                      <span className="small text-muted">Consultation Fee:</span>
                      <span className="fw-bold text-primary fs-6">₹{parseFloat(doc.consultation_fee).toFixed(2)}</span>
                    </div>
                    <div className="mt-auto d-grid gap-2">
                      <Link to={`/patient/book-appointment?doctorId=${doc.id}`} className="btn btn-teal btn-sm">
                        <i className="bi bi-calendar-plus me-1"></i> Book Visit
                      </Link>
                      <Link to={`/doctors/${doc.id}`} className="btn btn-outline-secondary btn-sm">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW APPOINTMENT BOOKING WORKS */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="text-teal fw-bold text-uppercase small">Simple & Fast</span>
            <h2 className="fw-bold mt-1">How Appointment Booking Works</h2>
            <p className="text-muted">Book your appointment in 3 easy steps in less than 60 seconds.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number">1</div>
                <div className="fs-1 text-primary my-3"><i className="bi bi-person-lines-fill"></i></div>
                <h5 className="fw-bold">1. Select Doctor</h5>
                <p className="text-muted small">
                  Filter specialists by department, consultation fee, medical qualification, and experience.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number">2</div>
                <div className="fs-1 text-teal my-3"><i className="bi bi-calendar-check"></i></div>
                <h5 className="fw-bold">2. Choose Date & Slot</h5>
                <p className="text-muted small">
                  Pick a convenient calendar date and select an available time slot from the live schedule.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-number">3</div>
                <div className="fs-1 text-success my-3"><i className="bi bi-shield-check"></i></div>
                <h5 className="fw-bold">3. Instant Confirmation</h5>
                <p className="text-muted small">
                  Receive an instant digital booking confirmation voucher and live dashboard tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE US */}
      <section className="py-5">
        <div className="container py-3">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="text-primary fw-bold text-uppercase small">Why Choose Us</span>
              <h2 className="fw-bold mt-1 mb-4">Patient-First Care Powered by Modern Technology</h2>
              
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-primary text-white p-3 rounded-3 fs-4">
                  <i className="bi bi-award"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Top-Tier Clinical Specialists</h5>
                  <p className="text-muted small mb-0">
                    Over 50+ senior consultants and surgeons with international fellowships and decades of clinical success.
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bg-teal text-white p-3 rounded-3 fs-4">
                  <i className="bi bi-lightning-charge"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Zero Waiting Queue</h5>
                  <p className="text-muted small mb-0">
                    Guaranteed appointment slots with prioritized OPD tokens to save your precious time.
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="bg-success text-white p-3 rounded-3 fs-4">
                  <i className="bi bi-shield-lock"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">Secure & Private Health Records</h5>
                  <p className="text-muted small mb-0">
                    Encrypted patient portals ensuring complete privacy for medical histories and diagnostic reports.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 bg-primary text-white p-4 p-md-5 rounded-4 shadow">
                <h3 className="fw-bold mb-3">Need Immediate Consultation?</h3>
                <p className="text-light opacity-90 mb-4">
                  Our emergency outpatient triage and general medicine clinics are active 24 hours a day, 7 days a week.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/patient/book-appointment" className="btn btn-warning fw-bold px-4 py-2">
                    Book Online Now
                  </Link>
                  <Link to="/contact" className="btn btn-outline-light fw-bold px-4 py-2">
                    Contact Helpline
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
