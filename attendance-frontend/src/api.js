import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-attendance-api-jibv.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false // ✅ Change to false for Vercel + Render
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
