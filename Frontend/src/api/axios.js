import axios from 'axios';

// Fallback URL (in case .env fails)
const BASE_URL = import.meta.env.VITE_API_URL || "https://team-task-manager-production-ccb8.up.railway.app/api";

const api = axios.create({
    baseURL: BASE_URL,
});

// Attach token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: global error handling (helps debugging)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error?.response || error.message);
        return Promise.reject(error);
    }
);

export default api;