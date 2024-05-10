import axios from 'axios';
import { refresh } from './LoginService';

const instance = axios.create();

const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refreshToken');
  if (refresh_token !== '' && refresh_token !== null) {
    try {
      const response = await refresh({ refresh_token });
      if (response) {
        const accessToken = response?.access_token;
        const newRefreshToken = response?.refresh_token;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        return accessToken;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }
};



instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // config.headers.tenantid = '4783a636-1191-487a-8b09-55eca51b5036';
    // config.headers.tenantid = 'fbe108db-e236-48a7-8230-80d34c370800';
    config.headers.tenantid = 'ef99949b-7f3a-4a5f-806a-e67e683e38f3';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.data.statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        if (!accessToken) {
          window.location.href = '/logout';
        }
        return instance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
