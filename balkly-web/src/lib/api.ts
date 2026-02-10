import axios from 'axios';
import { fetchPlatinumListEvents, getPlatinumListEvent } from './platinumlist';

// Get API URL - use window.location.origin for dynamic URLs
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const baseUrl = window.location.origin + '/api/v1';
    console.log('API Base URL:', baseUrl);
    return baseUrl;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api/v1';
};

const API_BASE_URL = getApiUrl();
console.log('Axios configured with base URL:', API_BASE_URL);

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
  getAll: async (params?: any) => {
    console.log('eventsAPI.getAll called with params:', params);
    const response = await api.get('/events', { params });
    console.log('RAW API RESPONSE:', JSON.stringify(response.data, null, 2));
    console.log('Total from API:', response.data?.total);
    console.log('Data array length:', response.data?.data?.length);
    console.log('First 3 events:', response.data?.data?.slice(0, 3));
    return response;
  },
  
  getOne: async (id: string) => {
    // Check if it's a platinumlist event (prefixed with 'pl-')
    if (id.startsWith('pl-')) {
      const event = await getPlatinumListEvent(id);
      return { data: { event } };
    }
    return api.get(`/events/${id}`);
  },
  
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

export const jobsAPI = {
  getAll: (params?: any) => api.get('/jobs', { params }),
  getOne: (id: string) => api.get(`/jobs/${id}`),
  getFeatured: (limit?: number) => api.get('/jobs/featured', { params: { limit } }),
  getCategories: () => api.get('/jobs/categories'),
};

