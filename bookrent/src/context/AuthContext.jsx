import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Ensure this matches your running server port
const API_URL = 'http://localhost:5000/api';

const AuthContext = createContext(null);

// HELPER: Set the "Authorization" header globally
const setAuthToken = (token) => {
  if (token) {
    // Backend expects: Authorization: Bearer <token>
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');

    if (token && storedUser) {
      setAuthToken(token);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // SIGNUP
  const signup = useCallback(async (userData) => {
    // Matches server route: /api/auth/signup
    await axios.post(`${API_URL}/auth/signup`, userData);
  }, []);

  // LOGIN
  const login = useCallback(async (email, password) => {
    // Matches server route: /api/auth/login
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    
    const { token, user: loggedInUser } = response.data;
    
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    setAuthToken(token);
    setUser(loggedInUser);
    
    return loggedInUser;
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setAuthToken(null);
    navigate('/login');
  }, [navigate]);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    signup,
    logout
  }), [user, loading, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};