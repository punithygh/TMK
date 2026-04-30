import axios from 'axios';

// 🚀 1. ಮ್ಯಾಜಿಕ್ ಲಿಂಕ್: NEXT_PUBLIC_API_URL ಇಲ್ಲದಿದ್ದರೆ ನೇರವಾಗಿ ಲೋಕಲ್ ಬ್ಯಾಕೆಂಡ್‌ಗೆ ಕನೆಕ್ಟ್ ಆಗುತ್ತದೆ
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000') + '/api/v1';

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

  // 🚨 Trailing Slash Enforcer (Django ಗೆ ಇದು ಅತಿ ಮುಖ್ಯ)
  if (config.url) {
    const [path, queryString] = config.url.split('?');
    let safePath = path;
    if (!safePath.endsWith('/')) {
      safePath = `${safePath}/`;
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
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // window.location.href = '/login'; // ಇದನ್ನು ಸದ್ಯಕ್ಕೆ ಕಾಮೆಂಟ್ ಮಾಡಿಡಿ, ಆರಾಮಾಗಿ ಲಾಗಿನ್ ಪೇಜ್ ಆಮೇಲೆ ನೋಡೋಣ
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;