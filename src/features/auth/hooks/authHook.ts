"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { authKeys } from "../queryKeys";
import { authService } from "../services/authService";
import {
  type NonceRequest,
  type VerifyRequest,
  type RegisterRequest,
  type LoginRequest,
  type VerifyOtpRequest,
} from "../schema/auth";
import { qc } from "@/state/query/queryClient";

export function useGetNonce() {
  return useMutation({
    mutationFn: (request: NonceRequest) => authService.getNonce(request),
  });
}

export function useVerifySignature() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (request: VerifyRequest) => authService.verify(request),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

export const setUserToNull = async () => {
  await qc.setQueryData(authKeys.me(), null);
};

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.getMe(),
    retry: false,
  });
}

export function useIsAuthenticated() {
  const { data: user, isLoading } = useMe();
  return {
    isAuthenticated: !!user,
    isLoading,
  };
}

export function useRegister() {
  return useMutation({
    mutationFn: (request: RegisterRequest) => authService.register(request),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (request: LoginRequest) => authService.login(request),
  });
}

export function useVerifyRegisterOtp() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (request: VerifyOtpRequest) =>
      authService.verifyRegisterOtp(request),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

export function useVerifyLoginOtp() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (request: VerifyOtpRequest) =>
      authService.verifyLoginOtp(request),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch (error) {
        // Continue with cleanup even if logout request fails
      }
      Cookies.remove("at");
    },
    onSuccess: () => {
      qc.removeQueries({ queryKey: authKeys.all });
    },
  });
}
