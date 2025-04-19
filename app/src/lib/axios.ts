import axios from 'axios';
import { store } from './store';
import { clearMember } from './store/slices/memberSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rcx_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    config.headers.Accept = 'application/json';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearMember());
      localStorage.removeItem('rcx_auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;