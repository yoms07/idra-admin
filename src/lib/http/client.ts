import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { setUserToNull } from "@/features/auth";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = Cookies.get("at");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove("at");
      await setUserToNull();
    }
    return Promise.reject(error);
  }
);

export type HttpError = AxiosError & { userMessage?: string };
