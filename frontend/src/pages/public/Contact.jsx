import React, { useState } from 'react';
import AlertMessage from '../../components/AlertMessage';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'General Inquiry',
        subject: '',
        message: ''
      });
    }, 600);
  };

  return (
    <div className="py-5">
      <div className="container mb-5">
        <div className="text-center">
          <span className="text-primary fw-bold text-uppercase small">24/7 Assistance</span>
          <h1 className="display-5 fw-bold mt-1 mb-2">Contact CareConnect Hospital</h1>
          <p className="text-muted mx-auto lead" style={{ maxWidth: '650px' }}>
            Have a question, feedback, or emergency inquiry? Our team of medical coordinators is available round-the-clock.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="row g-5">
          {/* Contact Information & Map */}
          <div className="col-lg-5">
            <div className="card p-4 border-0 shadow-sm bg-primary text-white rounded-4 mb-4">
              <h4 className="fw-bold mb-4">Hospital Helpline & Location</h4>

              <div className="d-flex align-items-start gap-3 mb-4">
                <i className="bi bi-geo-alt-fill fs-4 text-warning"></i>
                <div>
                  <h6 className="fw-bold mb-1">Main Campus Address</h6>
                  <p className="text-light opacity-90 small mb-0">
                    CareConnect Hospital, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bangalore, Karnataka - 560038
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <i className="bi bi-telephone-fill fs-4 text-warning"></i>
                <div>
                  <h6 className="fw-bold mb-1">Emergency 24x7 Casualty</h6>
                  <p className="text-light opacity-90 small mb-0">+91 (80) 2345-6789 / 1066</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <i className="bi bi-envelope-fill fs-4 text-warning"></i>
                <div>
                  <h6 className="fw-bold mb-1">Email Inquiries</h6>
                  <p className="text-light opacity-90 small mb-0">appointments@careconnect.com</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <i className="bi bi-clock-fill fs-4 text-warning"></i>
                <div>
                  <h6 className="fw-bold mb-1">OPD Consultation Hours</h6>
                  <p className="text-light opacity-90 small mb-0">
                    Monday – Saturday: 08:00 AM – 08:00 PM<br />
                    Sunday & Holidays: Emergency Trauma Only
                  </p>
                </div>
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="card p-3 border-0 shadow-sm rounded-4 text-center">
              <div className="bg-light p-4 rounded-3 border d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '180px' }}>
                <i className="bi bi-map text-primary fs-1 mb-2"></i>
                <h6 className="fw-bold mb-1">Interactive Campus Navigation</h6>
                <small className="text-muted">Directly opposite HAL Heritage Centre, Indiranagar</small>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="col-lg-7">
            <div className="card p-4 p-md-5 border-0 shadow-sm rounded-4">
              <h3 className="fw-bold mb-2">Send Us a Message</h3>
              <p className="text-muted mb-4 small">
                Fill out the form below and our patient care team will respond within 2 hours.
              </p>

              {submitted && (
                <AlertMessage
                  type="success"
                  message="Thank you! Your message has been received. Our coordinator will contact you shortly."
                  onClose={() => setSubmitted(false)}
                />
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
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

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Department / Department</label>
                    <select
                      className="form-select"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Billing & Insurance">Billing & Insurance</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Subject *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Summary of inquiry"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Message *</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Please write your detailed medical or general inquiry..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Submitting message...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill me-2"></i> Submit Inquiry
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

export default Contact;
