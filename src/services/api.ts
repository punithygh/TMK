import axios from 'axios';

// Get base URL from environment variable, fallback to default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// Create a centralized Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure we send cookies if required
  withCredentials: true,
});

// 🚨 CRITICAL FIX: Interceptor to enforce trailing slashes for Django DRF
api.interceptors.request.use((config) => {
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