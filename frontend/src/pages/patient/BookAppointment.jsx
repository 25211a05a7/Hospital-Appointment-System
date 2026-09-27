import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AlertMessage from '../../components/AlertMessage';

const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM'
];

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const preselectedDoctorId = searchParams.get('doctorId') || '';

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDoctorId);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');

  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get today's ISO date string (YYYY-MM-DD) for min date validation
  const todayDateStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.getDoctors({ active: 'true' });
        if (res.success) {
          setDoctors(res.doctors || []);
          if (preselectedDoctorId) {
            setSelectedDoctorId(preselectedDoctorId);
          } else if (res.doctors && res.doctors.length > 0) {
            setSelectedDoctorId(String(res.doctors[0].id));
          }
        }
      } catch (err) {
        console.error('Failed to load doctors for booking:', err);
      } finally {
        setFetchingDoctors(false);
      }
    };

    fetchDoctors();
  }, [preselectedDoctorId]);

  // Selected Doctor Object
  const selectedDoctor = doctors.find((d) => String(d.id) === String(selectedDoctorId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedDoctorId || !appointmentDate || !appointmentTime || !reason.trim()) {
      setError('Please fill in all fields (Doctor, Date, Time Slot, and Reason for visit).');
      return;
    }

    // Past date check
    if (appointmentDate < todayDateStr) {
      setError('Cannot book appointments for past dates. Please select today or a future date.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.bookAppointment({
        doctor_id: parseInt(selectedDoctorId, 10),
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason: reason.trim()
      });

      if (res.success && res.appointment) {
        setSuccess('Appointment successfully booked! Redirecting to appointment details...');
        setTimeout(() => {
          navigate(`/patient/appointments/${res.appointment.id}`);
        }, 1200);
      } else {
        setError(res.message || 'Failed to book appointment.');
      }
    } catch (err) {
      setError(err.message || 'Slot conflict: Doctor is not available at this selected time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-primary fw-bold text-uppercase small">Instant Online OPD Scheduling</span>
          <h1 className="display-6 fw-bold mt-1 mb-2">Book a Doctor's Appointment</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Choose your specialist, pick an open date, select an available time slot, and reserve your consultation.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="row g-4">
              {/* Form Column */}
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                  <h4 className="fw-bold mb-3">Appointment Details</h4>

                  {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}
                  {success && <AlertMessage type="success" message={success} />}

                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Select Doctor */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-person-badge text-primary me-1"></i> 1. Select Consulting Doctor *
                      </label>
                      {fetchingDoctors ? (
                        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                      ) : (
                        <select
                          className="form-select form-select-lg fs-6"
                          value={selectedDoctorId}
                          onChange={(e) => setSelectedDoctorId(e.target.value)}
                          required
                        >
                          <option value="">-- Choose Specialist --</option>
                          {doctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.name} — {doc.specialization} (₹{parseFloat(doc.consultation_fee).toFixed(0)})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Step 2: Select Date */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-calendar3 text-teal me-1"></i> 2. Select Date *
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-lg fs-6"
                        min={todayDateStr}
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                      />
                      <small className="text-muted">Appointments available up to 60 days in advance.</small>
                    </div>

                    {/* Step 3: Select Time Slot */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold d-block">
                        <i className="bi bi-clock text-primary me-1"></i> 3. Select Time Slot *
                      </label>
                      <div className="row g-2">
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = appointmentTime === slot;
                          return (
                            <div key={slot} className="col-4 col-sm-3">
                              <button
                                type="button"
                                className={`btn w-100 py-2 small fw-semibold border ${
                                  isSelected ? 'btn-primary shadow-sm text-white' : 'btn-outline-secondary'
                                }`}
                                onClick={() => setAppointmentTime(slot)}
                              >
                                {slot}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      {appointmentTime && (
                        <div className="mt-2 small text-teal fw-semibold">
                          <i className="bi bi-check2-circle me-1"></i> Selected Slot: {appointmentTime}
                        </div>
                      )}
                    </div>

                    {/* Step 4: Reason for Visit */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-card-text text-secondary me-1"></i> 4. Reason for Visit / Symptoms *
                      </label>
                      <textarea
                        rows="3"
                        className="form-control"
                        placeholder="Briefly describe your symptoms or reason for medical consultation..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-teal btn-lg w-100 fw-bold py-3 shadow-sm"
                      disabled={loading || !selectedDoctorId || !appointmentDate || !appointmentTime}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Securing Appointment...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle-fill me-2"></i> Confirm & Book Appointment
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Doctor Summary Column */}
              <div className="col-lg-5">
                {selectedDoctor ? (
                  <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
                    <h5 className="fw-bold mb-3 border-bottom pb-2">Booking Summary</h5>

                    <div className="d-flex align-items-center gap-3 mb-3">
                      <img
                        src={selectedDoctor.profile_image}
                        alt={selectedDoctor.name}
                        className="rounded-circle object-fit-cover shadow-sm"
                        style={{ width: 70, height: 70 }}
                      />
                      <div>
                        <h6 className="fw-bold mb-0">{selectedDoctor.name}</h6>
                        <span className="badge bg-primary-light text-primary small">
                          {selectedDoctor.specialization}
                        </span>
                        <div className="text-muted small mt-1">{selectedDoctor.qualification}</div>
                      </div>
                    </div>

                    <div className="bg-light p-3 rounded-3 mb-3 small">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Doctor Availability:</span>
                        <span className="fw-semibold text-end">{selectedDoctor.available_days}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Hospital Hours:</span>
                        <span className="fw-semibold text-end">{selectedDoctor.available_timings}</span>
                      </div>
                      <div className="d-flex justify-content-between pt-2 border-top">
                        <span className="text-muted">Consultation Fee:</span>
                        <span className="fw-bold text-primary fs-6">
                          ₹{parseFloat(selectedDoctor.consultation_fee).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {appointmentDate && (
                      <div className="alert alert-info py-2 small mb-3">
                        <i className="bi bi-calendar-event me-1"></i>
                        Date: <strong>{appointmentDate}</strong> | Slot: <strong>{appointmentTime || 'Pending'}</strong>
                      </div>
                    )}

                    <div className="small text-muted">
                      <i className="bi bi-shield-lock me-1 text-success"></i>
                      Instant appointment confirmation with automatic hospital database record creation.
                    </div>
                  </div>
                ) : (
                  <div className="card border-0 shadow-sm rounded-4 p-4 text-center text-muted">
                    <i className="bi bi-person-badge fs-1 mb-2"></i>
                    <p>Select a doctor on the left to preview consultation summary.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
