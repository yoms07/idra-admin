import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { authKeys } from "@/features/auth/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { qc } from "@/state/query/queryClient";
import { setUserToNull } from "@/features/auth";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        console.log("invalidate begin");
        await setUserToNull();
        console.log("invalidate success");
      }
    }
    return Promise.reject(error);
  }
);

export type HttpError = AxiosError & { userMessage?: string };
