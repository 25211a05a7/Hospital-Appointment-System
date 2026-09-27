const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Universal fetch wrapper for CareConnect Hospital REST APIs
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = localStorage.getItem('careconnect_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (patientData) => request('/auth/register', { method: 'POST', body: patientData }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: profileData }),

  // Doctors
  getDoctors: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/doctors${query ? `?${query}` : ''}`);
  },
  getDoctorById: (id) => request(`/doctors/${id}`),
  createDoctor: (docData) => request('/doctors', { method: 'POST', body: docData }),
  updateDoctor: (id, docData) => request(`/doctors/${id}`, { method: 'PUT', body: docData }),
  deleteDoctor: (id, hard = false) => request(`/doctors/${id}?hardDelete=${hard}`, { method: 'DELETE' }),

  // Departments
  getDepartments: () => request('/departments'),

  // Appointments
  bookAppointment: (bookingData) => request('/appointments', { method: 'POST', body: bookingData }),
  getMyAppointments: () => request('/appointments/my'),
  getAllAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/appointments${query ? `?${query}` : ''}`);
  },
  getAppointmentById: (id) => request(`/appointments/${id}`),
  updateAppointmentStatus: (id, status) => request(`/appointments/${id}/status`, { method: 'PATCH', body: { status } }),
  cancelAppointment: (id) => request(`/appointments/${id}/cancel`, { method: 'PATCH' }),

  // Patients (Admin)
  getPatients: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/patients${query ? `?${query}` : ''}`);
  },
  getPatientById: (id) => request(`/patients/${id}`),

  // Dashboard Stats
  getDashboardStats: () => request('/dashboard/stats'),

  // Health
  getHealth: () => request('/health')
};

export default api;
