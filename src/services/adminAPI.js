import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance for admin
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add admin token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Admin API Request:', config.method?.toUpperCase(), config.url, config.headers);
    return config;
  },
  (error) => {
    console.error('Admin API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
adminApi.interceptors.response.use(
  (response) => {
    console.log('Admin API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('Admin API Response Error:', error.response?.status, error.config?.url, error.response?.data);
    
    // Only redirect to login if it's not the login endpoint itself AND it's a real 401
    if (error.response?.status === 401 && 
        !error.config?.url.includes('/admin/auth/login') &&
        !error.config?.url.includes('/admin/dashboard/overview')) {
      console.log('401 error on non-login endpoint, redirecting to admin login');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    
    return Promise.reject(error);
  }
);

// Admin Auth API
export const adminAPI = {
  login: (credentials) =>
    adminApi.post('/admin/auth/login', credentials),
  
  getProfile: () =>
    adminApi.get('/admin/auth/me'),
  
  updateProfile: (data) =>
    adminApi.put('/admin/auth/profile', data),
  
  changePassword: (data) =>
    adminApi.put('/admin/auth/password', data),
};

// Admin Dashboard API
export const adminDashboardAPI = {
  getOverview: () =>
    adminApi.get('/admin/dashboard/overview'),
  
  getAllVideos: (params = {}) =>
    adminApi.get('/admin/dashboard/videos', { params }),
  
  updateVideoStatus: (videoId, status) =>
    adminApi.put(`/admin/dashboard/videos/${videoId}/status`, { status }),
  
  deleteVideo: (videoId) =>
    adminApi.delete(`/admin/dashboard/videos/${videoId}`),
  
  getAllUsers: (params = {}) =>
    adminApi.get('/admin/dashboard/users', { params }),
  
  getUserDetails: (userId) =>
    adminApi.get(`/admin/dashboard/users/${userId}`),
};

export default adminApi;
