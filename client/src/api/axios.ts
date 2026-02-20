// client/src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('auth-storage');
  const isCloudinary = config.url?.includes('cloudinary.com');

  if (authData && !isCloudinary) {
    try {
      const parsed = JSON.parse(authData);
      const token = parsed.state?.token; // Zustand Persist nesting
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Axios Interceptor: Could not parse token", e);
    }
  }
  return config;
}, (error) => Promise.reject(error));

export default api;