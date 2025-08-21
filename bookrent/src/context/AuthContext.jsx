// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5001/api';
const AuthContext = createContext(null);

// 1. CREATE A HELPER FUNCTION TO SET THE TOKEN
// This function will be used in multiple places.
const setAuthToken = (token) => {
  if (token) {
    // Apply the token to every subsequent request
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    // Remove the token
    delete axios.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};


export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. THIS IS THE CRITICAL FIX
  // This useEffect runs only once when the app first loads.
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');

    if (token && storedUser) {
      // If a token exists, set it for all axios requests
      setAuthToken(token);
      // And restore the user state
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // We are done with the initial load
  }, []); // Empty dependency array means it runs only once


  const signup = useCallback(async (userData) => {
    await axios.post(`${API_URL}/auth/signup`, userData);
  }, []);


  const login = useCallback(async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    
    const { token, user: loggedInUser } = response.data;
    
    // Save the user and the token
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    setAuthToken(token);
    setUser(loggedInUser);
    
    return loggedInUser;
  }, []);


  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setAuthToken(null); // This will also remove the token from localStorage
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