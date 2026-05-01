import axios from 'axios';

let BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
let IS_PROXY = false;

// 📱 MOBILE FIX 4.0: Bulletproof Next.js Proxy Architecture
// If running in browser and API is localhost, use the Next.js Rewrite proxy `/django-api`.
if (typeof window !== 'undefined' && BASE_URL) {
  try {
    const url = new URL(BASE_URL);
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') {
      BASE_URL = '/django-api';
      IS_PROXY = true;
    }
  } catch (e) {
    // Ignore URL parsing errors
  }
}

const API_BASE_URL = IS_PROXY ? BASE_URL : BASE_URL + '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    // Language Sync
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    let lang = match ? match[2] : 'kn';
    
    config.headers['Accept-Language'] = lang;
    config.params = config.params || {};
    if (!config.params.lang) config.params.lang = lang;

    // Authorization Token
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // 🚨 Trailing Slash Logic (Next.js vs Django conflict fix)
  if (config.url) {
    const [path, queryString] = config.url.split('?');
    let safePath = path;
    
    if (IS_PROXY) {
      // 1. In Browser (Proxy): Strip trailing slash to prevent Next.js 308 Redirect.
      // The Next.js rewrite rule will append the trailing slash before hitting Django.
      if (safePath.endsWith('/')) {
        safePath = safePath.slice(0, -1);
      }
    } else {
      // 2. On Server (Direct): Enforce trailing slash to prevent Django 301 Redirect.
      if (!safePath.endsWith('/')) {
        safePath = `${safePath}/`;
      }
    }
    
    config.url = queryString ? `${safePath}?${queryString}` : safePath;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 🚨 ಟೋಕನ್ ರಿಫ್ರೆಶ್ ಲಾಜಿಕ್ (auth/refresh/ ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
        
        if (refreshToken) {
          // ಇಲ್ಲಿ 'auth/refresh/' ಬಳಸುತ್ತಿದ್ದೇವೆ, ಯಾಕೆಂದರೆ ನಿಮ್ಮ Django urls.py ನಲ್ಲಿದೆ
          const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken
          });
          
          if (res.data && res.data.access) {
            localStorage.setItem('access_token', res.data.access);
            originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
            return api(originalRequest);
          }
        }
        throw new Error('Refresh failed or no refresh token');
      } catch (refreshError) {
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