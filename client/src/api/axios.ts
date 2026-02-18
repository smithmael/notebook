import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('auth-storage');
  
  // ✅ STRICT SECURITY: Do not send token to Cloudinary
  const isCloudinary = config.url?.includes('cloudinary.com');

  if (authData && !isCloudinary) {
    try {
      const { state } = JSON.parse(authData);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (e) {
      console.error("Auth error", e);
    }
  }
  return config;
}, (error) => Promise.reject(error));
export default api;