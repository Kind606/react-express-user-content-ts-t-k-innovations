import axios from "axios";

// In production, this will be proxied to your backend via vercel.json
// In development, Vite proxy handles it (vite.config.ts)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {},
  withCredentials: true,
});

export default api;
