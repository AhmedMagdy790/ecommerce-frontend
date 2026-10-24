import { type AxiosInstance, AxiosError } from "axios";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import toast from "react-hot-toast";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const setupInterceptors = (apiClient: AxiosInstance) => {
  let isRefreshing = false;

  interface FailedRequest {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }

  let failedQueue: FailedRequest[] = [];

  const processQueue = (
    error: unknown,
    token: string | null = null
  ) => {

    failedQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else if (token) {
        request.resolve(token);
      } else {
        request.reject(new Error("Refresh returned no token"));
      }
    });

    failedQueue = [];
  };

  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }

      return config;
    },
    (error) => {
      console.error("[REQUEST AUTH] Request setup failed", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => {

      return response;
    },

    async (error: AxiosError) => {
      const originalRequest = error.config;
      const requestUrl = originalRequest?.url || "";
      const status = error.response?.status;


      if (!originalRequest) {
        console.error("[AUTH INTERCEPTOR] Missing original request config");
        return Promise.reject(error);
      }

      if (status === 403) {
        toast.error("ليس لديك صلاحية للقيام بهذا الإجراء");
        return Promise.reject(error);
      }

      if (status !== 401) {
        return Promise.reject(error);
      }

      // Do not recursively refresh auth endpoints.
      const excludedEndpoints = [
        "/auth/login",
        "/auth/register",
        "/auth/get-access-token",
        "/auth/rotate-refresh",
        "/auth/me",
      ];

      if (excludedEndpoints.some((endpoint) => requestUrl.includes(endpoint))) {
        console.warn("[AUTH INTERCEPTOR] Refresh skipped for excluded endpoint", {
          url: requestUrl,
        });

        return Promise.reject(error);
      }

      if (originalRequest._retry) {

        return Promise.reject(error);
      }

      // Another request is already refreshing the token.
      if (isRefreshing) {

        originalRequest._retry = true;

        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

     let newToken: string;

      try {
        newToken = await useAuthStore.getState().updateAccessToken();

        if (!newToken) {
          throw new Error("Refresh completed without an access token");
        }

        processQueue(null, newToken);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }

      // Retry is deliberately outside the refresh try/catch.
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      try {
        const retryResponse = await apiClient(originalRequest);

        return retryResponse;
      } catch (retryError) {

        return Promise.reject(retryError);
      }
    }
  );
};