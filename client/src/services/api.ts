import axios from "axios";

// In production, this will be proxied to your backend via vercel.json
// In development, Vite proxy handles it (vite.config.ts)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {},
  withCredentials: true,
});

// Add interceptor to include Authorization header from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sessionToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
