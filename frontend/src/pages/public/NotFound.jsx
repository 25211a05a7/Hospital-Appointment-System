import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="py-5 bg-light min-vh-80 d-flex align-items-center">
      <div className="container text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto" style={{ maxWidth: 600 }}>
          <div className="display-1 fw-extrabold text-primary mb-2">404</div>
          <h2 className="fw-bold mb-3">Page Not Found</h2>
          <p className="text-muted mb-4">
            The page or clinical portal route you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-primary px-4 py-2 fw-semibold">
              <i className="bi bi-house-door me-2"></i> Return Home
            </Link>
            <Link to="/doctors" className="btn btn-outline-secondary px-4 py-2 fw-semibold">
              Find Doctors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
