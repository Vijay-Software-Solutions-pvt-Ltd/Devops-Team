// client/src/services/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem('token');
}

const api = axios.create({
  baseURL: "https://exam-backend-982394596304.asia-south1.run.app",
  timeout: 15000,               
  withCredentials: false     
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/#/login";
    }
    return Promise.reject(err);
  }
);

export default api;