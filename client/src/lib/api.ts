import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Forces IPv4 to prevent local DNS bugs
});

// Automatically injects the Authorization Bearer Token into headers before requests leave
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;