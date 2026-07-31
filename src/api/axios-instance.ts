// src/api/axios-instance.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/config';
import { setupInterceptors } from './interceptors';
import { useAuthStore } from '@/store/authStore';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${env.API_BASE_URL}/api/v1`,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});


const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    const xsrfToken = getCookie("XSRF-TOKEN");

    if (xsrfToken) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    }


    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }


    return config;
  },
  (error) => Promise.reject(error)
);

setupInterceptors(axiosInstance);




export default axiosInstance;