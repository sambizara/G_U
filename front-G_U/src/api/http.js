import axios from 'axios';

const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('univ_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('univ_token')) {
      localStorage.removeItem('univ_token');
      localStorage.removeItem('univ_user');
      if (window.location.pathname !== '/connexion') window.location.assign('/connexion');
    }
    return Promise.reject(error);
  }
);

export default http;
