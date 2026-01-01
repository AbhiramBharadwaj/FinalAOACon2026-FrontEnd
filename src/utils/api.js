// src/utils/api.js
import axios from 'axios';

const API_URL = 'https://finalaoa2026-backend.onrender.com/api';
export const API_BASE_URL = API_URL.replace(/\/api$/, '');
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
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
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
};
export const attendanceAPI = {
  getMyQr: () => api.get('/attendance/my-qr'),
  generateQr: (registrationId) => api.post(`/attendance/generate-qr/${registrationId}`),
};
export const registrationAPI = {
  create: (data) => {
    console.log('FormData being sent:');
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }
    return api.post('/registration', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getMyRegistration: () => api.get('/registration/my-registration'),
  getPricing: () => api.get('/registration/pricing'),
};

export const paymentAPI = {
  createOrderRegistration: () => api.post('/payment/create-order/registration'),
  createOrderAccommodation: (bookingId) =>
    api.post('/payment/create-order/accommodation', { bookingId }),
  verifyPayment: (data) => api.post('/payment/verify', data),
  paymentFailed: (data) => api.post('/payment/failed', data),
};

export const accommodationAPI = {
  getAll: () => api.get('/accommodation'),
  getById: (id) => api.get(`/accommodation/${id}`),
  book: (data) => api.post('/accommodation/book', data),
  getMyBookings: () => api.get('/accommodation/my-bookings'),
};

export const abstractAPI = {
  submit: (formData) => api.post('/abstract/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyAbstract: () => api.get('/abstract/my-abstract'),
  getAll: (params) => api.get('/abstract/all', { params }),
  review: (id, data) => api.put(`/abstract/review/${id}`, data),
};

export const feedbackAPI = {
  submit: (data) => api.post('/feedback/submit', data),
  getMyFeedback: () => api.get('/feedback/my-feedback'),
  getAll: () => api.get('/feedback/all'),
  getAnalytics: () => api.get('/feedback/analytics'),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getRegistrations: (params) => api.get('/admin/registrations', { params }),
  deleteRegistration: (id) => api.delete(`/admin/registrations/${id}`),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  bulkDeleteUsers: (ids) => api.post('/admin/users/bulk-delete', { ids }),
  getPayments: (params) => api.get('/admin/payments', { params }),
  createAccommodation: (data) => api.post('/admin/accommodations', data),
  updateAccommodation: (id, data) => api.put(`/admin/accommodations/${id}`, data),
  deleteAccommodation: (id) => api.delete(`/admin/accommodations/${id}`),
  getAccommodationBookings: (params) => api.get('/admin/accommodation-bookings', { params }),
};

export default api;
