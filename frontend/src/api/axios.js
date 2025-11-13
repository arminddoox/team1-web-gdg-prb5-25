import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// Token Management
// ============================================
export const getToken = () => localStorage.getItem('auth_token');
export const setToken = (token) => localStorage.setItem('auth_token', token);
export const clearToken = () => localStorage.removeItem('auth_token');

// ============================================
// Request Interceptor - Add Auth Token
// ============================================
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// ============================================
// ✅ Navigation Integration (tránh reload cứng)
// ============================================
let navigateFunction = null;

export const registerNavigate = (navigate) => {
  navigateFunction = navigate;
};

export const safeNavigate = (path) => {
  if (navigateFunction) {
    navigateFunction(path, { replace: true });
  } else {
    console.warn('⚠️ Navigate chưa đăng ký, fallback reload:', path);
    window.location.href = path;
  }
};

// ============================================
// Response Interceptor - Handle Errors
// ============================================
axiosInstance.interceptors.response.use(
  (response) => response.data, // Auto-unwrap data
  (error) => {
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      clearToken();
      safeNavigate('/login');
    }
    
    // Log errors in dev
    if (import.meta.env.DEV) {
      console.error('API Error:', error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// Export API Helper
// ============================================
export const api = {
  get: (url, config) => axiosInstance.get(url, config),
  post: (url, data, config) => axiosInstance.post(url, data, config),
  put: (url, data, config) => axiosInstance.put(url, data, config),
  patch: (url, data, config) => axiosInstance.patch(url, data, config),
  delete: (url, config) => axiosInstance.delete(url, config),
};

export default axiosInstance;