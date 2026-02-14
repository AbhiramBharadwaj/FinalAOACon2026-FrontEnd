// src/utils/api.js
import axios from 'axios';

const API_URL = 'https://api.aoacon2026.com/api';
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
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  adminForgotPassword: (email) => api.post('/auth/admin/forgot-password', { email }),
  adminResetPassword: (data) => api.post('/auth/admin/reset-password', data),
};

export const userAPI = {
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  uploadCollegeLetter: (formData) =>
    api.post('/auth/profile/college-letter', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
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
  applyCoupon: (couponCode) => api.post('/registration/apply-coupon', { couponCode }),
  validateCoupon: () => api.post('/registration/validate-coupon'),
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
  reviewCollegeLetter: (userId, status) =>
    api.post(`/admin/college-letters/${userId}/review`, { status }),
  getPayments: (params) => api.get('/admin/payments', { params }),
  createAccommodation: (data) => api.post('/admin/accommodations', data),
  updateAccommodation: (id, data) => api.put(`/admin/accommodations/${id}`, data),
  deleteAccommodation: (id) => api.delete(`/admin/accommodations/${id}`),
  getAccommodationBookings: (params) => api.get('/admin/accommodation-bookings', { params }),
  getManualRegistrationAvailability: (params) =>
    api.get('/admin/manual-registrations/availability', { params }),
  getManualRegistrationQuote: (data) => api.post('/admin/manual-registrations/quote', data),
  createManualRegistration: (data) => api.post('/admin/manual-registrations', data),
  getRegistrationCounter: () => api.get('/admin/counters/registration-number'),
  updateRegistrationCounter: (seq) => api.put('/admin/counters/registration-number', { seq }),
  resendRegistrationEmail: (id) => api.post(`/admin/registrations/${id}/resend-email`),
};

export default api;
