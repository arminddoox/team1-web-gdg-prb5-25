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
// Response Interceptor - Handle Errors
// ============================================
axiosInstance.interceptors.response.use(
  (response) => response.data, // Auto-unwrap data
  (error) => {
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/login';
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










/* ============================================
  Below is the full-featured Axios instance, the advanced version.
*/ 


// import axios from 'axios';

// /**
//  * Axios Instance Configuration
//  * 
//  * Setup Instructions:
//  * 1. Register navigate function in App.jsx: registerNavigate(navigate)
//  * 2. Register loading callback in App.jsx: setLoadingCallback(setIsLoading)
//  * 3. Define window.showToast in main.jsx or App.jsx for toast notifications
//  *    Example: window.showToast = (message, type) => toast[type](message);
//  * 
//  * Security Note:
//  * - Tokens are stored in localStorage for simplicity and persistence across sessions
//  * - Be aware of XSS risks: ensure your app sanitizes user input and uses Content Security Policy
//  * - Consider httpOnly cookies for production if higher security is required
//  */

// // ============================================
// // Configuration
// // ============================================
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
// const TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;
// const TOKEN_KEY = 'auth_token';
// const REFRESH_TOKEN_KEY = 'refresh_token';
// const LOADING_DELAY = 300; // ms delay before hiding loader
// const TOAST_THROTTLE_TIME = 2000; // ms cooldown between identical toasts

// // ============================================
// // Axios Instance
// // ============================================
// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: TIMEOUT,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ============================================
// // Navigation Management
// // ============================================
// let navigateFunction = null;

// /**
//  * Register React Router's navigate function for redirects
//  * Usage in App.jsx: registerNavigate(navigate)
//  */
// export const registerNavigate = (navigate) => {
//   navigateFunction = navigate;
// };

// /**
//  * Safely redirect to a route using navigate if available, otherwise fallback to window.location
//  */
// const safeRedirect = (path, options = {}) => {
//   if (navigateFunction) {
//     navigateFunction(path, options);
//   } else {
//     console.warn(`Navigate function not registered. Falling back to window.location for: ${path}`);
//     window.location.href = path;
//   }
// };

// const redirectToLogin = () => {
//   clearTokens();
//   safeRedirect('/login', { replace: true });
// };

// // ============================================
// // Loading State Management
// // ============================================
// let activeRequests = 0;
// let loadingCallback = null;
// let hideLoadingTimeout = null;

// export const setLoadingCallback = (callback) => {
//   loadingCallback = callback;
// };

// const updateLoadingState = (isLoading) => {
//   if (!loadingCallback) return;

//   if (isLoading) {
//     // Clear any pending hide timeout
//     if (hideLoadingTimeout) {
//       clearTimeout(hideLoadingTimeout);
//       hideLoadingTimeout = null;
//     }
//     loadingCallback(true);
//   } else {
//     // Only hide loader when all requests are complete
//     if (activeRequests === 0) {
//       // Delay hiding loader to avoid flicker
//       if (hideLoadingTimeout) {
//         clearTimeout(hideLoadingTimeout);
//       }
//       hideLoadingTimeout = setTimeout(() => {
//         // Double-check activeRequests hasn't changed during delay
//         if (activeRequests === 0) {
//           loadingCallback(false);
//         }
//         hideLoadingTimeout = null;
//       }, LOADING_DELAY);
//     }
//   }
// };

// const incrementRequests = () => {
//   activeRequests++;
//   if (activeRequests === 1) {
//     updateLoadingState(true);
//   }
// };

// const decrementRequests = () => {
//   // Safety guard: prevent counter from going negative due to race conditions
//   if (activeRequests > 0) {
//     activeRequests--;
//     if (activeRequests === 0) {
//       updateLoadingState(false);
//     }
//   } else if (import.meta.env.DEV) {
//     console.warn('⚠️ Attempted to decrement activeRequests below 0');
//   }
// };

// // ============================================
// // Toast Notification Helper
// // ============================================
// const toastCache = new Map();

// const toastError = (msg) => {
//   if (!window.showToast) return;

//   const now = Date.now();
//   const lastShown = toastCache.get(msg);

//   // Throttle identical messages
//   if (lastShown && now - lastShown < TOAST_THROTTLE_TIME) {
//     return;
//   }

//   toastCache.set(msg, now);
//   window.showToast(msg, 'error');

//   // Clean up old entries to prevent memory leak
//   setTimeout(() => {
//     toastCache.delete(msg);
//   }, TOAST_THROTTLE_TIME);
// };

// // ============================================
// // Token Management
// // ============================================
// export const getToken = () => {
//   return localStorage.getItem(TOKEN_KEY);
// };

// export const setToken = (token) => {
//   localStorage.setItem(TOKEN_KEY, token);
// };

// export const getRefreshToken = () => {
//   return localStorage.getItem(REFRESH_TOKEN_KEY);
// };

// export const setRefreshToken = (token) => {
//   localStorage.setItem(REFRESH_TOKEN_KEY, token);
// };

// export const clearTokens = () => {
//   localStorage.removeItem(TOKEN_KEY);
//   localStorage.removeItem(REFRESH_TOKEN_KEY);
// };

// // ============================================
// // Token Refresh Logic
// // ============================================
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// const refreshAccessToken = async () => {
//   const refreshToken = getRefreshToken();
  
//   if (!refreshToken) {
//     throw new Error('No refresh token available');
//   }

//   try {
//     // Use global axios instance (not axiosInstance) to avoid interceptor recursion
//     // This prevents the refresh request from triggering another 401 → refresh loop
//     const response = await axios.post(
//       `${BASE_URL}/auth/refresh`,
//       { refreshToken },
//       { headers: { 'Content-Type': 'application/json' } }
//     );

//     const { token, refreshToken: newRefreshToken } = response.data;
    
//     setToken(token);
//     if (newRefreshToken) {
//       setRefreshToken(newRefreshToken);
//     }

//     return token;
//   } catch (error) {
//     clearTokens();
//     throw error;
//   }
// };

// // ============================================
// // Duplicate Request Prevention
// // ============================================
// /**
//  * Deduplication Strategy:
//  * - Only idempotent methods (GET, HEAD, OPTIONS) are deduplicated
//  * - Request key = method + baseURL + url + sorted params (JSON-stringified)
//  * - Duplicate requests are cancelled using AbortController
//  * - Each request stores its key in config._requestKey for consistent cleanup
//  */
// const pendingRequests = new Map();
// const IDEMPOTENT_METHODS = ['GET', 'HEAD', 'OPTIONS'];

// const generateRequestKey = (config) => {
//   const method = config.method?.toUpperCase() || 'GET';
//   const baseURL = config.baseURL || '';
//   const url = config.url || '';
  
//   // Include sorted params for more accurate deduplication
//   let paramsKey = '';
//   if (config.params) {
//     try {
//       const sortedParams = Object.keys(config.params)
//         .sort()
//         .map(key => {
//           const value = config.params[key];
//           // Safely stringify values (handles objects, arrays, primitives)
//           const stringValue = typeof value === 'object' && value !== null
//             ? JSON.stringify(value)
//             : String(value);
//           return `${key}=${stringValue}`;
//         })
//         .join('&');
//       paramsKey = sortedParams ? `?${sortedParams}` : '';
//     } catch (error) {
//       // Fallback if JSON.stringify fails (e.g., circular references)
//       if (import.meta.env.DEV) {
//         console.warn('Failed to stringify params for request key:', error);
//       }
//       paramsKey = `?${Object.keys(config.params).sort().join(',')}`;
//     }
//   }
  
//   return `${method}_${baseURL}${url}${paramsKey}`;
// };

// const cancelPendingRequest = (key) => {
//   const controller = pendingRequests.get(key);
//   if (controller) {
//     controller.abort();
//     pendingRequests.delete(key);
//   }
// };

// const addPendingRequest = (config) => {
//   const method = config.method?.toUpperCase() || 'GET';
//   const key = generateRequestKey(config);
  
//   // Attach request key to config for consistent cleanup
//   config._requestKey = key;
  
//   // Only cancel duplicates for idempotent methods (safe operations)
//   if (IDEMPOTENT_METHODS.includes(method)) {
//     cancelPendingRequest(key);
//   }
  
//   // Respect existing signal if provided by caller, otherwise create new AbortController
//   if (!config.signal) {
//     const controller = new AbortController();
//     config.signal = controller.signal;
//     pendingRequests.set(key, controller);
//   }
  
//   return key;
// };

// const removePendingRequest = (config) => {
//   const key = config._requestKey || generateRequestKey(config);
//   pendingRequests.delete(key);
// };

// // Clean up pending requests on window unload to prevent memory leaks
// if (typeof window !== 'undefined') {
//   window.addEventListener('beforeunload', () => {
//     pendingRequests.forEach((controller, key) => {
//       controller.abort();
//     });
//     pendingRequests.clear();
//   });
// }

// // ============================================
// // Request Interceptor
// // ============================================
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Increment active requests immediately
//     incrementRequests();

//     try {
//       // Handle duplicate request cancellation and attach request key
//       addPendingRequest(config);

//       // Attach JWT token if available (merge with existing headers)
//       const token = getToken();
//       if (token) {
//         config.headers = {
//           ...config.headers,
//           Authorization: `Bearer ${token}`,
//         };
//       }

//       // Log request in development
//       if (import.meta.env.DEV) {
//         console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
//         console.log('Config:', config);
//         console.groupEnd();
//       }

//       return config;
//     } catch (error) {
//       // Clean up pending request on error
//       if (config._requestKey) {
//         removePendingRequest(config);
//       }
      
//       // Decrement counter immediately on error
//       decrementRequests();
      
//       if (import.meta.env.DEV) {
//         console.error('❌ Request Interceptor Error:', error);
//       }
      
//       return Promise.reject(error);
//     }
//   },
//   (error) => {
//     // Decrement active requests on error
//     decrementRequests();

//     if (import.meta.env.DEV) {
//       console.error('❌ Request Error:', error);
//     }

//     return Promise.reject(error);
//   }
// );

// // ============================================
// // Response Interceptor
// // ============================================
// axiosInstance.interceptors.response.use(
//   (response) => {
//     const requestKey = generateRequestKey(response.config);
    
//     try {
//       // Log response in development
//       if (import.meta.env.DEV) {
//         console.group(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
//         console.log('Status:', response.status);
//         console.log('Data:', response.data);
//         console.groupEnd();
//       }

//       // Unwrap response data
//       return response.data;
//     } catch (error) {
//       if (import.meta.env.DEV) {
//         console.error('❌ Response Processing Error:', error);
//       }
//       return response.data;
//     } finally {
//       // Always clean up
//       removePendingRequest(requestKey);
//       decrementRequests();
//     }
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     const requestKey = originalRequest ? generateRequestKey(originalRequest) : null;

//     try {
//       // Log error in development
//       if (import.meta.env.DEV) {
//         console.group(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`);
//         console.log('Status:', error.response?.status);
//         console.log('Error:', error.response?.data || error.message);
//         console.groupEnd();
//       }

//       // Handle request cancellation (both axios.CancelToken and AbortController)
//       if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
//         if (import.meta.env.DEV) {
//           console.log('🚫 Request cancelled:', originalRequest?.url);
//         }
//         return Promise.reject(error);
//       }

//       // Handle 401 Unauthorized - Token Refresh
//       // Guard: Ensure originalRequest exists and has not been retried
//       if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
//         if (isRefreshing) {
//           // Queue the request while token is being refreshed
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject });
//           })
//             .then((token) => {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//               return axiosInstance(originalRequest);
//             })
//             .catch((err) => {
//               return Promise.reject(err);
//             });
//         }

//         originalRequest._retry = true;
//         isRefreshing = true;

//         try {
//           const newToken = await refreshAccessToken();
//           processQueue(null, newToken);
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           return axiosInstance(originalRequest);
//         } catch (refreshError) {
//           processQueue(refreshError, null);
          
//           // Redirect to login
//           redirectToLogin();
          
//           return Promise.reject(refreshError);
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       // Handle other status codes
//       if (error.response) {
//         const status = error.response.status;
//         const message = error.response.data?.message || error.message;

//         switch (status) {
//           case 403:
//             console.error('Access forbidden:', message);
//             toastError('Access denied. You do not have permission.');
//             break;

//           case 404:
//             console.error('Resource not found:', message);
//             toastError('Resource not found.');
//             break;

//           case 500:
//             console.error('Server error:', message);
//             toastError('Server error. Please try again later.');
//             break;

//           default:
//             console.error('Request failed:', message);
//             toastError(message || 'Something went wrong.');
//         }
//       } else if (error.request) {
//         // Request was made but no response received
//         console.error('No response received:', error.request);
//         toastError('Network error. Please check your connection.');
//       } else {
//         // Something else happened
//         console.error('Request setup error:', error.message);
//         toastError('Request failed. Please try again.');
//       }

//       return Promise.reject(error);
//     } finally {
//       // Always clean up
//       if (requestKey) {
//         removePendingRequest(requestKey);
//       }
//       decrementRequests();
//     }
//   }
// );

// // ============================================
// // Initialization Helper
// // ============================================
// /**
//  * Initialize axios instance with navigation and loading callbacks
//  * Usage in App.jsx:
//  * 
//  * import { initializeAxios } from './axios';
//  * 
//  * function App() {
//  *   const navigate = useNavigate();
//  *   const [isLoading, setIsLoading] = useState(false);
//  *   
//  *   useEffect(() => {
//  *     initializeAxios(navigate, setIsLoading);
//  *   }, [navigate]);
//  * }
//  */
// export const initializeAxios = (navigate, setLoading) => {
//   if (navigate) {
//     registerNavigate(navigate);
//   }
//   if (setLoading) {
//     setLoadingCallback(setLoading);
//   }
// };

// // ============================================
// // API Wrapper (Lightweight Helper)
// // ============================================
// const api = {
//   request: (config) => axiosInstance.request(config),
//   get: (url, config) => axiosInstance.get(url, config),
//   post: (url, data, config) => axiosInstance.post(url, data, config),
//   put: (url, data, config) => axiosInstance.put(url, data, config),
//   patch: (url, data, config) => axiosInstance.patch(url, data, config),
//   delete: (url, config) => axiosInstance.delete(url, config),
// };

// // ============================================
// // Export
// // ============================================
// export { api };
// export default axiosInstance;