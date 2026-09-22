import axios from "axios";

const api = axios.create({
  baseURL: "https://kingdine.onrender.com/api",

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