import axios from "axios";

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:8081';
  // Ensure the URL ends with /api
  if (!url.endsWith('/api') && !url.endsWith('/api/')) {
    url = `${url.endsWith('/') ? url.slice(0, -1) : url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        const token = userInfo?.token || userInfo?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Error parsing userInfo for token", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
