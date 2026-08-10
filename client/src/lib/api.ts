import axios from "axios";

const api = axios.create({
  baseURL: "https://kingdine-1.onrender.com/api",

});

// Automatically injects the Authorization Bearer Token into headers before requests leave
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization =` Bearer ${token}`;
      // Bearer ${token};
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;