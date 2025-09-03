import axios from "axios";

// ✅ Correct Render Backend URL
const API = axios.create({
  baseURL: "https://smart-attendance-api-jibv.onrender.com/api", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Attach Token Automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle Unauthorized Responses
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      console.warn("⚠ Unauthorized. Logging out...");
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;

