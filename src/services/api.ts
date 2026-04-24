import axios from 'axios';

// Get base URL dynamically based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1` : "";

// Create a centralized Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure we send cookies if required
  withCredentials: true,
  // 🚨 3. Axios Timeout to prevent UI freezes
  timeout: 10000,
});

// 🚨 CRITICAL FIX: Interceptor to enforce trailing slashes and Language Sync
api.interceptors.request.use((config) => {
  // 1. Language Cookie Sync
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    const oldMatch = document.cookie.match(new RegExp('(^| )googtrans=([^;]+)'));
    let lang = 'kn'; // default
    if (match) {
      lang = match[2];
    } else if (oldMatch) {
      lang = oldMatch[2].includes('en') ? 'en' : 'kn';
    }
    
    // Attach standard Accept-Language header
    config.headers['Accept-Language'] = lang;
    
    // Attach language to query parameters for strict Django DRF parsing
    config.params = config.params || {};
    if (!config.params.lang) {
      config.params.lang = lang;
    }

    // 🚨 1.5. Authorization Token Sync
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // 2. Trailing Slash Enforcer for Django DRF
  if (config.url) {
    // Check if URL has query parameters
    const [path, queryString] = config.url.split('?');
    
    // If the path doesn't end with a slash, add it (preventing 301 redirects)
    let safePath = path;
    if (!safePath.endsWith('/')) {
      safePath = `${safePath}/`;
    }
    
    // Reassemble the URL
    config.url = queryString ? `${safePath}?${queryString}` : safePath;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 🚨 3. Response Interceptor for JWT Auto-Refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if it's a 401 Unauthorized error and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
        
        if (refreshToken) {
          // Attempt to get a new access token
          const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken
          });
          
          if (res.data && res.data.access) {
            // Store the new token
            localStorage.setItem('access_token', res.data.access);
            
            // Update the authorization header and retry the original request
            originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and force login (graceful degradation)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;