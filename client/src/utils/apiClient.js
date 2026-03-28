/* eslint-disable no-console */
import axios from 'axios';
import { supabase } from '../supabaseClient';

const baseURL = import.meta.env.VITE_API_URL || '/api';
const apiClient = axios.create({ 
  baseURL,
  timeout: 10000, // 10 second timeout - fail fast on network issues
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Supabase JWT to every request automatically
apiClient.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error('Error fetching auth session for API request:', error);
  }
  return config;
});

// Response interceptor for JWT refresh and global error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data: { session } } = await supabase.auth.refreshSession();
        if (session?.access_token) {
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.warn('Token refresh failed:', refreshError);
      }
      // If refresh failed, redirect to login
      window.location.href = '/login?expired=true';
      return Promise.reject(error);
    }
    
    // Handle timeout errors with specific message
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timeout:', error.message);
    }
    
    // Handle network errors
    if (!navigator.onLine) {
      console.warn('Network offline');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
