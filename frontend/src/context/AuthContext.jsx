import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('careconnect_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('careconnect_token');
      const storedUser = localStorage.getItem('careconnect_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with backend
          const res = await api.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('careconnect_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('careconnect_token', res.token);
      localStorage.setItem('careconnect_user', JSON.stringify(res.user));
    }
    return res;
  };

  const demoLogin = async (role) => {
    let email = 'patient@careconnect.com';
    let password = 'Patient@123';

    if (role === 'doctor') {
      email = 'doctor@careconnect.com';
      password = 'Doctor@123';
    } else if (role === 'admin') {
      email = 'admin@careconnect.com';
      password = 'Admin@123';
    }

    return login(email, password);
  };

  const register = async (patientData) => {
    const res = await api.register(patientData);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('careconnect_token', res.token);
      localStorage.setItem('careconnect_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('careconnect_token');
    localStorage.removeItem('careconnect_user');
  };

  const updateUser = (updatedData) => {
    setUser(prev => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem('careconnect_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        demoLogin,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
