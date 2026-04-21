import axios from 'axios';

// 🚨 100% BULLETPROOF BASE URL NORMALIZATION 🚨
// .env ಫೈಲ್‌ನಲ್ಲಿ ಯಾವುದೇ ರೀತಿಯಲ್ಲಿ (slash ಇದ್ದು/ಇಲ್ಲದೆ) URL ಕೊಟ್ಟರೂ ಕ್ರಾಶ್ ಆಗದಂತೆ ನೋಡಿಕೊಳ್ಳುವ ಲಾಜಿಕ್.
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// 1. ಕೊನೆಯಲ್ಲಿರುವ ಸ್ಲ್ಯಾಶ್ (/) ಅನ್ನು ತೆಗೆಯುವುದು
let cleanBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

// 2. ಡಬಲ್ `/api/v1` ಬಾರದಂತೆ ತಡೆಯುವುದು
// .env ಫೈಲ್‌ನಲ್ಲಿ ಈಗಾಗಲೇ /api/v1 ಇದ್ದರೆ, ಮತ್ತೆ ಸೇರಿಸುವುದಿಲ್ಲ. ಇಲ್ಲದಿದ್ದರೆ ಸೇರಿಸುತ್ತದೆ.
const finalBaseUrl = cleanBaseUrl.endsWith('/api/v1') 
  ? cleanBaseUrl 
  : `${cleanBaseUrl}/api/v1`;

const api = axios.create({
  baseURL: finalBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 ಸೆಕೆಂಡ್ ಮೀರಿದರೆ ಟೈಮ್‌ಔಟ್
});

// 🚀 Request Interceptor (Optional: ಟೋಕನ್ ಸೇರಿಸಲು ಭವಿಷ್ಯದಲ್ಲಿ ಬೇಕಾಗುತ್ತದೆ)
api.interceptors.request.use(
  (config) => {
    // ಕನ್ಸೋಲ್‌ನಲ್ಲಿ ಕಾಲ್ ಆಗುತ್ತಿರುವ ನಿಖರವಾದ URL ನೋಡಲು (ಡೀಬಗ್ಗಿಂಗ್‌ಗಾಗಿ)
    // console.log("🚀 API Call To:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🚀 Response Interceptor (Error Handling)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 404 ಎರರ್ ಬಂದಾಗ ಕನ್ಸೋಲ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾದ ಮೆಸೇಜ್ ತೋರಿಸುವುದು
    if (error.response && error.response.status === 404) {
      console.error(`🚨 [API ERROR 404]: The endpoint ${error.config.url} was not found. Please check urls.py in Django.`);
    }
    return Promise.reject(error);
  }
);

export default api;