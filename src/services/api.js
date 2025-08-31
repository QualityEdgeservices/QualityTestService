// src/services/api.js
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  googleAuth: (data) => api.post('/auth/google', data),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getTestHistory: (page = 1, limit = 10) => api.get(`/user/test-history?page=${page}&limit=${limit}`),
  getPerformance: () => api.get('/user/performance'),
  getSavedTests: () => api.get('/user/saved-tests'),
  getUpcomingTests: () => api.get('/user/upcoming-tests'),
  getAchievements: () => api.get('/user/achievements'),
  updateSettings: (settings) => api.put('/user/settings', settings),
};

// Exam API
export const examAPI = {
  getAllExams: (page = 1, limit = 12) => api.get(`/exams?page=${page}&limit=${limit}`),
  getExamDetail: (examId) => api.get(`/exams/${examId}`),
  searchExams: (query, page = 1, limit = 12) => api.get(`/exams/search?q=${query}&page=${page}&limit=${limit}`),
};

// Test API
export const testAPI = {
  getTest: (testId) => api.get(`/tests/${testId}`),
  startTest: (testId) => api.post(`/tests/${testId}/start`),
  submitTest: (testId, data) => api.post(`/tests/${testId}/submit`, data),
  getTestResults: (testId) => api.get(`/tests/${testId}/results`),
  saveTestProgress: (testId, data) => api.put(`/tests/${testId}/progress`, data),
};

// Admin API
export const adminAPI = {
  createExam: (data) => api.post('/admin/exams', data),
  updateExam: (examId, data) => api.put(`/admin/exams/${examId}`, data),
  deleteExam: (examId) => api.delete(`/admin/exams/${examId}`),
  createTest: (data) => api.post('/admin/tests', data),
  updateTest: (testId, data) => api.put(`/admin/tests/${testId}`, data),
  deleteTest: (testId) => api.delete(`/admin/tests/${testId}`),
  getUsers: (page = 1, limit = 10) => api.get(`/admin/users?page=${page}&limit=${limit}`),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  getStatistics: () => api.get('/admin/statistics'),
};

export default api;