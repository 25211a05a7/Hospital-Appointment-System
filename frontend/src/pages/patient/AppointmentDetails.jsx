import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchDetails = async () => {
    try {
      const res = await api.getAppointmentById(id);
      if (res.success && res.appointment) {
        setAppointment(res.appointment);
      } else {
        setError(res.message || 'Appointment not found.');
      }
    } catch (err) {
      setError(err.message || 'Error fetching appointment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await api.cancelAppointment(id);
      if (res.success) {
        setMessage({ type: 'success', text: 'Appointment cancelled successfully.' });
        fetchDetails();
      } else {
        setMessage({ type: 'danger', text: res.message || 'Failed to cancel.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Error cancelling appointment.' });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2">Loading appointment voucher...</p>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 p-5 shadow-sm rounded-4 mx-auto" style={{ maxWidth: 600 }}>
          <i className="bi bi-exclamation-triangle fs-1 text-danger mb-3"></i>
          <h4>Appointment Not Found</h4>
          <p className="text-muted">{error || 'Unable to find the requested appointment record.'}</p>
          <Link to="/patient/appointments" className="btn btn-primary mt-3 mx-auto">
            Back to My Appointments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Breadcrumb navigation */}
        <div className="d-flex justify-content-between align-items-center mb-4 no-print">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/patient/dashboard">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/patient/appointments">Appointments</Link></li>
              <li className="breadcrumb-item active">Voucher #{appointment.id}</li>
            </ol>
          </nav>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary btn-sm" onClick={() => window.print()}>
              <i className="bi bi-printer-fill me-1"></i> Print Slip
            </button>
            <Link to="/patient/appointments" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-arrow-left me-1"></i> Back
            </Link>
          </div>
        </div>

        {message && (
          <div className="no-print mb-3">
            <AlertMessage type={message.type} message={message.text} onClose={() => setMessage(null)} />
          </div>
        )}

        {/* Printable Voucher Card */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white printable-area">
          {/* Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-4 mb-4 gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-hospital fs-2 text-primary"></i>
                <h3 className="fw-bold mb-0 text-primary">CareConnect Hospital</h3>
              </div>
              <small className="text-muted">100 Feet Road, Indiranagar, Bangalore - 560038 | Tel: +91 (80) 2345-6789</small>
            </div>
            <div className="text-sm-end">
              <span className={`badge badge-${appointment.status.toLowerCase()} fs-6 px-3 py-2`}>
                {appointment.status}
              </span>
              <div className="text-muted small mt-1">Appointment Token: <strong>#{appointment.id}</strong></div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Patient Info */}
            <div className="col-md-6">
              <div className="bg-light p-3 rounded-3 h-100">
                <h6 className="fw-bold text-primary mb-3">
                  <i className="bi bi-person-fill me-1"></i> Patient Information
                </h6>
                <div className="small mb-1"><strong>Name:</strong> {appointment.patient_name}</div>
                <div className="small mb-1"><strong>Email:</strong> {appointment.patient_email}</div>
                <div className="small mb-1"><strong>Phone:</strong> {appointment.patient_phone}</div>
                <div className="small mb-1"><strong>Gender:</strong> {appointment.patient_gender || 'Not specified'}</div>
                <div className="small"><strong>Blood Group:</strong> {appointment.patient_blood_group || 'N/A'}</div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="col-md-6">
              <div className="bg-light p-3 rounded-3 h-100">
                <h6 className="fw-bold text-teal mb-3">
                  <i className="bi bi-heart-pulse-fill me-1"></i> Consulting Doctor
                </h6>
                <div className="small mb-1"><strong>Doctor:</strong> {appointment.doctor_name}</div>
                <div className="small mb-1"><strong>Specialization:</strong> {appointment.doctor_specialization}</div>
                <div className="small mb-1"><strong>Qualification:</strong> {appointment.doctor_qualification}</div>
                <div className="small mb-1"><strong>Hospital Timings:</strong> {appointment.doctor_timings}</div>
                <div className="small"><strong>Doctor Email:</strong> {appointment.doctor_email}</div>
              </div>
            </div>
          </div>

          {/* Schedule Details Table */}
          <div className="table-responsive mb-4">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Appointment Date</th>
                  <th>Time Slot</th>
                  <th>Consultation Reason</th>
                  <th className="text-end">Consultation Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-bold text-dark">{appointment.appointment_date}</td>
                  <td className="fw-bold text-teal">{appointment.appointment_time}</td>
                  <td>{appointment.reason}</td>
                  <td className="text-end fw-bold text-primary fs-6">
                    ₹{parseFloat(appointment.consultation_fee).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Instructions */}
          <div className="border-top pt-3 text-muted small">
            <h6 className="fw-bold text-dark mb-2">Hospital OPD Instructions:</h6>
            <ul className="mb-0 ps-3">
              <li>Please arrive 15 minutes prior to your allocated appointment time slot at the OPD Registration Counter.</li>
              <li>Present this electronic confirmation slip or SMS voucher along with a valid Government Photo ID.</li>
              <li>For cancellations or rescheduling, please notify at least 2 hours in advance through the online portal.</li>
            </ul>
          </div>

          {/* Action Buttons (Excluded from print) */}
          <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center no-print flex-wrap gap-2">
            <button className="btn btn-primary" onClick={() => window.print()}>
              <i className="bi bi-printer me-1"></i> Print / Download Slip
            </button>

            {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
              <button className="btn btn-outline-danger" onClick={handleCancel}>
                <i className="bi bi-x-circle me-1"></i> Cancel Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
