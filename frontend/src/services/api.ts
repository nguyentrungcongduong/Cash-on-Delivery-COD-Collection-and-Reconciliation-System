import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error Response:', error.response);
        console.error('API Error Config:', error.config);

        const url = error.config?.url || '';
        const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register');

        if (!isAuthRequest && (error.response?.status === 401 || error.response?.status === 403)) {
            console.warn('Unauthorized access detected on non-auth endpoint. Redirecting to login...');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
