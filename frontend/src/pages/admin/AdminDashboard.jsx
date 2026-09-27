import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getDashboardStats();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Prepare Doughnut Chart Data for Status
  const doughnutData = {
    labels: stats?.chartStatus?.labels || ['Confirmed', 'Pending', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: stats?.chartStatus?.data || [5, 2, 8, 1],
        backgroundColor: stats?.chartStatus?.backgroundColor || ['#0d6efd', '#ffc107', '#198754', '#dc3545'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  // Prepare Bar Chart Data for Trends
  const barData = {
    labels: stats?.monthlyTrends?.labels || ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Monthly Appointment Bookings',
        data: stats?.monthlyTrends?.data || [14, 22, 35, 42, 56, 68],
        backgroundColor: '#0066cc',
        borderRadius: 6
      }
    ]
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <span className="badge bg-danger bg-opacity-10 text-danger mb-2 px-3 py-2 rounded-pill fw-bold">
                EXECUTIVE HOSPITAL ADMINISTRATION
              </span>
              <h2 className="fw-bold mb-1">CareConnect Administrative Control Center</h2>
              <p className="text-muted mb-0 small">
                Monitor hospital outpatient throughput, medical practitioners roster, and real-time appointment metrics.
              </p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/admin/doctors/new" className="btn btn-primary fw-bold">
                <i className="bi bi-person-plus-fill me-2"></i> Add Doctor
              </Link>
              <Link to="/admin/appointments" className="btn btn-outline-secondary fw-bold">
                <i className="bi bi-calendar2-range me-2"></i> Appointments
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Key Metric Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100">
              <div className="text-muted small fw-semibold">Total Patients</div>
              <div className="fs-3 fw-bold text-primary mt-1">{stats?.totalPatients ?? 0}</div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100">
              <div className="text-muted small fw-semibold">Active Doctors</div>
              <div className="fs-3 fw-bold text-teal mt-1">{stats?.totalDoctors ?? 0}</div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100">
              <div className="text-muted small fw-semibold">Total Bookings</div>
              <div className="fs-3 fw-bold text-dark mt-1">{stats?.totalAppointments ?? 0}</div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100">
              <div className="text-muted small fw-semibold">Confirmed</div>
              <div className="fs-3 fw-bold text-info mt-1">{stats?.confirmedAppointments ?? 0}</div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100">
              <div className="text-muted small fw-semibold">Pending</div>
              <div className="fs-3 fw-bold text-warning mt-1">{stats?.pendingAppointments ?? 0}</div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 shadow-sm rounded-3 p-3 text-center h-100">
              <div className="text-muted small fw-semibold">Completed</div>
              <div className="fs-3 fw-bold text-success mt-1">{stats?.completedAppointments ?? 0}</div>
            </div>
          </div>
        </div>

        {/* Visual Charts with Chart.js */}
        <div className="row g-4 mb-4">
          {/* Chart 1: Status Distribution */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-pie-chart-fill text-primary me-2"></i>
                Appointment Status Distribution
              </h5>
              <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '260px' }}>
                <div style={{ maxWidth: '280px', width: '100%' }}>
                  <Doughnut
                    data={doughnutData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Monthly Trends */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-bar-chart-fill text-teal me-2"></i>
                Monthly Patient Growth Trends
              </h5>
              <div style={{ minHeight: '260px' }}>
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }}
                  height={240}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Hospital Appointments */}
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Latest Hospital Appointments</h5>
            <Link to="/admin/appointments" className="btn btn-sm btn-link text-primary fw-semibold p-0">
              View All <i className="bi bi-chevron-right"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Token</th>
                    <th>Patient Name</th>
                    <th>Doctor</th>
                    <th>Specialty</th>
                    <th>Schedule</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentAppointments?.map((appt) => (
                    <tr key={appt.id}>
                      <td className="fw-bold text-muted">#{appt.id}</td>
                      <td className="fw-bold text-dark">{appt.patient_name}</td>
                      <td>{appt.doctor_name}</td>
                      <td className="small text-muted">{appt.specialization}</td>
                      <td className="small">
                        <div>{appt.appointment_date}</div>
                        <span className="text-teal">{appt.appointment_time}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${appt.status.toLowerCase()}`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
