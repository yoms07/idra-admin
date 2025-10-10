import axios, { AxiosError } from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  // Get auth token from localStorage or wherever it's stored
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    // normalize errors
    return Promise.reject(error);
  }
);

export type HttpError = AxiosError & { userMessage?: string };
