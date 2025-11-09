// src/services/http.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
console.log('API BASE URL:', BASE_URL);
export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

type Handlers = {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>; // return new access token (or null on failure)
  onLogout: () => void;
};

let handlers: Handlers = {
  getAccessToken: () => null,
  refreshAccessToken: async () => null,
  onLogout: () => {},
};

export function setAuthHandlers(h: Partial<Handlers>) {
  handlers = { ...handlers, ...h };
}

// Attach Authorization header
http.interceptors.request.use((config) => {
  const token = handlers.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (status === 401 && original && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        const newToken = await new Promise<string | null>((resolve) => pendingQueue.push(resolve));
        if (newToken) {
          original.headers = original.headers ?? {};
          (original.headers as any).Authorization = `Bearer ${newToken}`;
          return http(original);
        }
        handlers.onLogout();
        return Promise.reject(error);
      }

      try {
        isRefreshing = true;
        const newToken = await handlers.refreshAccessToken();
        pendingQueue.forEach((res) => res(newToken));
        pendingQueue = [];

        if (newToken) {
          original.headers = original.headers ?? {};
          (original.headers as any).Authorization = `Bearer ${newToken}`;
          return http(original);
        }
        handlers.onLogout();
        return Promise.reject(error);
      } catch (e) {
        pendingQueue.forEach((res) => res(null));
        pendingQueue = [];
        handlers.onLogout();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
