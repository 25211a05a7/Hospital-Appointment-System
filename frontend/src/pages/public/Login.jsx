import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AlertMessage from '../../components/AlertMessage';

const Login = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  const redirectAfterLogin = (role) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }

    if (role === 'admin') navigate('/admin/dashboard', { replace: true });
    else if (role === 'doctor') navigate('/doctor/dashboard', { replace: true });
    else navigate('/patient/dashboard', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success && res.user) {
        redirectAfterLogin(res.user.role);
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role) => {
    setError('');
    setDemoLoading(role);
    try {
      const res = await demoLogin(role);
      if (res.success && res.user) {
        redirectAfterLogin(res.user.role);
      } else {
        setError(res.message || 'Demo login failed.');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary-light text-primary rounded-circle p-3 mb-2">
                  <i className="bi bi-shield-lock-fill fs-2"></i>
                </div>
                <h3 className="fw-bold">Sign In to CareConnect</h3>
                <p className="text-muted small">Enter your credentials to access your portal</p>
              </div>

              {error && <AlertMessage type="danger" message={error} onClose={() => setError('')} />}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control border-start-0 border-end-0"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="input-group-text bg-white border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold py-3 shadow-sm" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i> Sign In
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Demo Logins Section */}
              <div className="mt-4 pt-3 border-top text-center">
                <span className="text-muted small fw-semibold text-uppercase d-block mb-2">
                  ⚡ 1-Click Faculty & Student Demo Logins
                </span>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm py-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleDemoClick('patient')}
                    disabled={demoLoading !== null}
                  >
                    <i className="bi bi-person text-primary"></i>
                    <span>Login as <strong>Patient (Rahul)</strong></span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm py-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleDemoClick('doctor')}
                    disabled={demoLoading !== null}
                  >
                    <i className="bi bi-heart-pulse text-success"></i>
                    <span>Login as <strong>Doctor (Dr. Rajesh)</strong></span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm py-2 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleDemoClick('admin')}
                    disabled={demoLoading !== null}
                  >
                    <i className="bi bi-shield-check text-dark"></i>
                    <span>Login as <strong>Administrator</strong></span>
                  </button>
                </div>
              </div>

              <div className="text-center mt-4 text-muted small">
                Don't have an account? <Link to="/register" className="text-teal fw-bold">Register here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
