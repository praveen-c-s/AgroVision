import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, getCurrentUser } from '../api/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();

      if (userData && userData.data) {
        setUser(userData.data);
        setError(null);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }

    } catch (error) {

      // 🔥 THIS IS THE FIX
      if (error.response?.status === 401) {
        // Not logged in — normal case
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } else {
        // Real backend failure
        setError("Server not reachable");
      }
    }

    setLoading(false);
  };

  checkAuth();
}, []);

  // Login function
const login = async (credentials) => {
  try {
    setLoading(true);

    const response = await loginService(credentials);
    const { access_token, data: userData } = response;

    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);

    setLoading(false);

    return { success: true, user: userData };

  } catch (error) {
    setLoading(false);

    return {
      success: false,
      error: error.response?.data?.error || "Login failed"
    };
  }
};

  // Register function
  const register = async (userData) => {
    try {
      const response = await registerService(userData);
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
    role: user?.role,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
