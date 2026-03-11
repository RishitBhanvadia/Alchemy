import axios from 'axios';
import logger from './logger';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export const getResult = (chemA, chemB, chemC, chemD) => {
  return api.get(`/result/${chemA}/${chemB}/${chemC}/${chemD}`);
};

export const getTitrationData = () => {
  return api.get('/titration');
};

export default api;
