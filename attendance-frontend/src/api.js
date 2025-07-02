import axios from "axios";

// 🔧 Axios instance with baseURL
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if using different port
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ⚠️ Optional: Handle global auth errors
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      console.warn("Unauthorized. Logging out...");
      localStorage.clear();
      window.location.href = "/login"; // Redirect to login if token expired/invalid
    }
    return Promise.reject(err);
  }
);

export default API;
