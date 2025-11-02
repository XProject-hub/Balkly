import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
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
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const listingsAPI = {
  getAll: (params?: any) => api.get('/listings', { params }),
  getOne: (id: string) => api.get(`/listings/${id}`),
  create: (data: any) => api.post('/listings', data),
  update: (id: string, data: any) => api.patch(`/listings/${id}`, data),
  delete: (id: string) => api.delete(`/listings/${id}`),
  publish: (id: string) => api.post(`/listings/${id}/publish`),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getAttributes: (id: string) => api.get(`/categories/${id}/attributes`),
};

export const eventsAPI = {
  getAll: (params?: any) => api.get('/events', { params }),
  getOne: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
};

export const forumAPI = {
  getCategories: () => api.get('/forum/categories'),
  getTopics: (params?: any) => api.get('/forum/topics', { params }),
  getTopic: (id: string) => api.get(`/forum/topics/${id}`),
  createTopic: (data: any) => api.post('/forum/topics', data),
  createPost: (data: any) => api.post('/forum/posts', data),
};

export const searchAPI = {
  search: (query: string, type?: string) => 
    api.get('/search', { params: { q: query, type } }),
};

