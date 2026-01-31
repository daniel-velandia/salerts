import { localStorageAdapter } from "@/infraestructure/persistence/localStorageAdapter";
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export const setupInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorageAdapter.get<string>("token");
      if (token && config.headers)
        config.headers.Authorization = `Bearer ${token}`;

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401)
        localStorageAdapter.remove("token");

      return Promise.reject(error);
    }
  );
};
