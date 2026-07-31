import { type AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const setupInterceptors = (apiClient: AxiosInstance) => {
  let isRefreshing = false;
  
  interface FailedRequest {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }

  let failedQueue: FailedRequest[] = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else if (token) prom.resolve(token);
    });
    failedQueue = [];
  };

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const requestUrl = originalRequest.url || '';

      // 1. Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (
          requestUrl.includes('/auth/login') ||
          requestUrl.includes('/auth/register') ||
          requestUrl.includes('/auth/refresh') ||
          requestUrl.includes('/auth/rotate-refresh') ||
          requestUrl.includes('/auth/me')
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await apiClient.post(
            "/auth/refresh",
            {},
            {
              withCredentials: true,
            }
          );

          const newToken = response.data?.data?.accessToken;

          if (!newToken) {
            throw new Error("No access token returned");
          }

          useAuthStore.getState().setAccessToken(newToken);
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);

        } catch (refreshError) {
          processQueue(refreshError, null);
          useAuthStore.getState().clearAuth();
          
          if (!window.location.pathname.includes('/auth/login')) {
            toast.error("انتهت الجلسة، يرجى تسجيل الدخول مجدداً");
            window.location.href = '/auth/login';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // 2. Handle 403 Forbidden errors
      if (error.response?.status === 403) {
        toast.error("ليس لديك صلاحية للقيام بهذا الإجراء");
      }

      return Promise.reject(error);
    }
  );
};