import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {},
  withCredentials: true,
});

export default api;
