// client/src/services/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('token');
}

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
