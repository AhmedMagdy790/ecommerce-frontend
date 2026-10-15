// src/api/axios-instance.ts
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/config';
import { setupInterceptors } from './interceptors';
import { useAuthStore } from '@/features/auth/model/store/useAuthStore';

const axiosInstance = axios.create({
  baseURL: `${env.API_BASE_URL}/api/v1`,
  withCredentials: true,
  timeout: 10000,
  headers: {
    Accept: "application/json",
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

    const currentLang = localStorage.getItem("app_lang") || "ar";
    
    console.log(currentLang)
    config.headers["Accept-Language"] = currentLang;

    return config;
  },
  (error) => Promise.reject(error)
);

setupInterceptors(axiosInstance);

export default axiosInstance;