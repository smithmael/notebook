import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // ❌ REMOVE 'Content-Type': 'application/json' from here
  // Letting it be empty allows Axios to auto-detect the content type
});

// ✅ Keep your interceptors as they are...
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('auth-storage');
  if (authData) {
    try {
      const { state } = JSON.parse(authData);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (e) {
      console.error("Auth parsing error", e);
    }
  }
  return config;
}, (error) => Promise.reject(error));

export default api;