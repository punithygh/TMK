import axios from 'axios';

// Get base URL from environment variable, fallback to default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://10.135.87.202:8000/api/v1';

// Create a centralized Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure we send cookies if required
  withCredentials: true,
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

export default api;