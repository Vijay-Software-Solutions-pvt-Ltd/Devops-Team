// client/src/services/api.js
import axios from 'axios';

const API_BASE = 'https://api-56f65wk7xq-uc.a.run.app';

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
