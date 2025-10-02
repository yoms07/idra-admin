import axios, { AxiosError } from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  // attach auth if available later
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
