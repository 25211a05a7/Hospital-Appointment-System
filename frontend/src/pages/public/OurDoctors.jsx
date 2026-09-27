import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const OurDoctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDept, setSelectedDept] = useState(searchParams.get('department') || 'all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.getDepartments();
        if (res.success) setDepartments(res.departments || []);
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = { active: 'true' };
        if (selectedDept && selectedDept !== 'all') {
          params.department = selectedDept;
        }
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        const res = await api.getDoctors(params);
        if (res.success) {
          setDoctors(res.doctors || []);
        }
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedDept, searchTerm]);

  const handleFilterChange = (e) => {
    setSelectedDept(e.target.value);
    setSearchParams(prev => {
      if (e.target.value === 'all') prev.delete('department');
      else prev.set('department', e.target.value);
      return prev;
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="text-primary fw-bold text-uppercase small">Medical Directory</span>
          <h1 className="display-6 fw-bold mt-1 mb-2">Find Our Specialist Doctors</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
            Book appointments with India's leading physicians, surgeons, and healthcare consultants.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card p-4 border-0 shadow-sm rounded-4 mb-5">
          <div className="row g-3 align-items-center">
            <div className="col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search doctor by name, qualification, or illness..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-funnel text-muted"></i>
                </span>
                <select className="form-select" value={selectedDept} onChange={handleFilterChange}>
                  <option value="all">All Specialties & Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Catalog Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading doctors...</span>
            </div>
            <p className="text-muted mt-2">Loading medical specialists...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-5 card border-0 p-5 rounded-4 shadow-sm">
            <i className="bi bi-person-x fs-1 text-muted mb-3"></i>
            <h4 className="fw-bold">No Doctors Found</h4>
            <p className="text-muted mb-4">No matching doctors were found for your current search criteria.</p>
            <button
              className="btn btn-outline-primary mx-auto"
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('all');
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {doctors.map((doc) => (
              <div key={doc.id} className="col-md-6 col-lg-3">
                <div className="doctor-card">
                  <div className="doctor-img-wrapper">
                    <img src={doc.profile_image} alt={doc.name} />
                    <span className="doctor-badge-dept">{doc.specialization}</span>
                  </div>
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <h5 className="fw-bold mb-1 text-dark">{doc.name}</h5>
                    <p className="text-primary small fw-semibold mb-2">{doc.qualification}</p>
                    
                    <div className="small text-muted mb-2">
                      <i className="bi bi-award me-1 text-warning"></i>
                      <span>{doc.experience} Years Experience</span>
                    </div>

                    <div className="small text-muted mb-3">
                      <i className="bi bi-clock me-1 text-teal"></i>
                      <span>{doc.available_timings}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3 pt-3 border-top">
                      <span className="small text-muted">Consultation Fee</span>
                      <span className="fw-bold text-dark fs-5">₹{parseFloat(doc.consultation_fee).toFixed(2)}</span>
                    </div>

                    <div className="mt-auto d-grid gap-2">
                      <Link to={`/patient/book-appointment?doctorId=${doc.id}`} className="btn btn-teal btn-sm">
                        <i className="bi bi-calendar2-check me-1"></i> Book Appointment
                      </Link>
                      <Link to={`/doctors/${doc.id}`} className="btn btn-outline-secondary btn-sm">
                        View Full Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OurDoctors;
