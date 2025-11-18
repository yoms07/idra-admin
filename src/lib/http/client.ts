import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { setUserToNull } from "@/features/auth";
import { RefreshResponseSchema } from "@/features/auth/schema/auth";
import {
  ACCESS_TOKEN_COOKIE,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  storeAuthTokens,
} from "@/features/auth/utils/tokens";
import Cookies from "js-cookie";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization =
      `Bearer ${token}`;
  }
  return config;
});

const refreshHttp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

const executeRefresh = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }
  const res = await refreshHttp.post("/api/auth/refresh", { refreshToken });
  const parsed = RefreshResponseSchema.parse(res.data);
  storeAuthTokens(
    parsed.data.accessToken,
    parsed.data.refreshToken,
    parsed.data.refreshTokenExpiresAt
  );
};

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (AxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (!refreshPromise) {
        refreshPromise = executeRefresh()
          .catch(async () => {
            clearAuthTokens();
            await setUserToNull();
            throw error;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        await refreshPromise;
        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as Record<string, string>).Authorization =
          `Bearer ${Cookies.get(ACCESS_TOKEN_COOKIE)}`;
        return http(originalRequest);
      } catch {
        clearAuthTokens();
        await setUserToNull();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export type HttpError = AxiosError & { userMessage?: string };
