import axios from "axios";

//  Axios instance with Render backend baseURL from .env
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE}/api`, 
  headers: {
    "Content-Type": "application/json",
  },
});

//  Automatically attach token (if available)
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
      console.warn("Unauthorized. Logging out...");
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
