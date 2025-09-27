import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://shyness-app-backend.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on a public route
      // and if the request was not for the /me endpoint (which is used for auth checking)
      const currentPath = window.location.pathname;
      const requestUrl = error.config?.url || '';
      const publicRoutes = ['/', '/login', '/register'];
      
      // Don't redirect if we're checking auth status or already on public routes
      if (!publicRoutes.includes(currentPath) && !requestUrl.includes('/auth/me')) {
        console.log('API Interceptor: 401 error, redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (name, email, password) =>
    api.post('/auth/signup', { name, email, password }),
  
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () =>
    api.get('/auth/me'),
  
  updateProfile: (name) =>
    api.put('/auth/profile', { name }),
};

// Topics API
export const topicsAPI = {
  getTopics: (params) =>
    api.get('/topics', { params }),
  
  getTopic: (id) =>
    api.get(`/topics/${id}`),
  
  getRandomTopic: (difficulty) =>
    api.get('/topics/random', { params: { difficulty } }),
  
  createTopic: (data) =>
    api.post('/topics', data),
  
  updateTopic: (id, data) =>
    api.put(`/topics/${id}`, data),
  
  deleteTopic: (id) =>
    api.delete(`/topics/${id}`),
};

// Videos API
export const videosAPI = {
  uploadVideo: (formData) =>
    api.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  getMyVideos: (params) =>
    api.get('/videos/my-videos', { params }),
  
  getVideo: (id) =>
    api.get(`/videos/${id}`),
  
  updateVideo: (id, data) =>
    api.put(`/videos/${id}`, data),
  
  deleteVideo: (id) =>
    api.delete(`/videos/${id}`),
};

// User API
export const userAPI = {
  getStreak: () =>
    api.get('/user/streak'),
  
  getRewards: () =>
    api.get('/user/rewards'),
  
  getDashboard: () =>
    api.get('/user/dashboard'),
  
  getStats: () =>
    api.get('/user/stats'),
  
  getProfile: () =>
    api.get('/auth/me'),
  
  updatePaymentInfo: (data) =>
    api.put('/user/payment-info', data),
  
  getPaymentInfo: () =>
    api.get('/user/payment-info'),
};


// Scripts API
export const scriptsAPI = {
  getCategories: () =>
    api.get('/scripts/categories'),
  
  getScriptsByCategory: (category, params) =>
    api.get(`/scripts/category/${category}`, { params }),
  
  getScript: (id) =>
    api.get(`/scripts/${id}`),
  
  searchScripts: (params) =>
    api.get('/scripts/search', { params }),
  
  downloadScript: (id) =>
    api.post(`/scripts/${id}/download`),
  
  getScriptStats: () =>
    api.get('/scripts/stats'),
};

// Payment API
export const paymentAPI = {
  getAllPayments: () =>
    api.get('/payments'),
  
  getPaymentStats: () =>
    api.get('/payments/stats'),
  
  createPayment: (data) =>
    api.post('/payments/create', data),
  
  updatePaymentStatus: (paymentId, data) =>
    api.put(`/payments/${paymentId}/status`, data),
};

// Health check
export const healthAPI = {
  check: () =>
    api.get('/health'),
};

export default api;

