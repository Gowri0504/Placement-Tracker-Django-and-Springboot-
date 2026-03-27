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

// Response interceptor for handling 401/403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Just clear local storage and let the ProtectedRoute in App.jsx 
      // handle the redirect naturally via the AuthContext state change.
      // This avoids 404 errors from window.location.href redirects.
      localStorage.removeItem("userInfo");
      
      // We only redirect if we're not already on login/signup to avoid loops
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        // Use a soft redirect if possible, but since this is axios, 
        // we'll just clear the state and let the app re-render.
        // If we really need a redirect, we can do it via state or a custom event.
        console.warn("Unauthorized access - clearing session");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
