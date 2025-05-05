import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    // Remove this default Content-Type as it will be overridden for FormData requests
    // "Content-Type": "application/json",
  },
  withCredentials: true, // Important for sending cookies with requests
});

export default api;
