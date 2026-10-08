import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mhf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mhf_token');
      localStorage.removeItem('mhf_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
};

// Donations
export const donationAPI = {
  createOrder: (data: any) => api.post('/donations/create-order', data),
  verify: (data: any) => api.post('/donations/verify', data),
  getAll: (params?: any) => api.get('/donations', { params }),
  getStats: () => api.get('/donations/stats/summary'),
};

// Volunteers
export const volunteerAPI = {
  apply: (data: any) => api.post('/volunteers', data),
  getAll: (params?: any) => api.get('/volunteers', { params }),
  update: (id: string, data: any) => api.put(`/volunteers/${id}`, data),
  delete: (id: string) => api.delete(`/volunteers/${id}`),
  getStats: () => api.get('/volunteers/stats/summary'),
};

// Campaigns
export const campaignAPI = {
  getAll: (params?: any) => api.get('/campaigns', { params }),
  getFeatured: () => api.get('/campaigns/featured'),
  getBySlug: (slug: string) => api.get(`/campaigns/slug/${slug}`),
  getById: (id: string) => api.get(`/campaigns/${id}`),
  create: (data: any) => api.post('/campaigns', data),
  update: (id: string, data: any) => api.put(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
};

// Stories
export const storyAPI = {
  getAll: (params?: any) => api.get('/stories', { params }),
  getFeatured: () => api.get('/stories/featured'),
  getBySlug: (slug: string) => api.get(`/stories/slug/${slug}`),
  getAllAdmin: (params?: any) => api.get('/stories/admin/all', { params }),
  create: (data: any) => api.post('/stories', data),
  update: (id: string, data: any) => api.put(`/stories/${id}`, data),
  delete: (id: string) => api.delete(`/stories/${id}`),
};

// Gallery
export const galleryAPI = {
  getAll: (params?: any) => api.get('/gallery', { params }),
  create: (data: any) => api.post('/gallery', data),
  update: (id: string, data: any) => api.put(`/gallery/${id}`, data),
  delete: (id: string) => api.delete(`/gallery/${id}`),
};

// Contact
export const contactAPI = {
  submit: (data: any) => api.post('/contact', data),
  getAll: (params?: any) => api.get('/contact', { params }),
  update: (id: string, data: any) => api.put(`/contact/${id}`, data),
  delete: (id: string) => api.delete(`/contact/${id}`),
};

// Partners
export const partnerAPI = {
  submit: (data: any) => api.post('/partners', data),
  getAll: (params?: any) => api.get('/partners', { params }),
  update: (id: string, data: any) => api.put(`/partners/${id}`, data),
  delete: (id: string) => api.delete(`/partners/${id}`),
};

// Impact
export const impactAPI = {
  getAll: (params?: any) => api.get('/impact', { params }),
  getAllAdmin: () => api.get('/impact/all'),
  create: (data: any) => api.post('/impact', data),
  update: (id: string, data: any) => api.put(`/impact/${id}`, data),
  delete: (id: string) => api.delete(`/impact/${id}`),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
};

export default api;
