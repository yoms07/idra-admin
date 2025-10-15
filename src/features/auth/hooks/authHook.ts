import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { authKeys } from "../queryKeys";
import { authService } from "../services/authService";
import { type NonceRequest, type VerifyRequest } from "../schema/auth";
import { isTheSameAddress } from "@/lib/utils";
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
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token);
      }

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
  const { data: user, isLoading, error } = useMe();
  const { address, isConnecting: isWalletConnecting } = useAccount();
  const isAuthenticated =
    !!user && !error && isTheSameAddress(user.walletAddress, address || "");
  return {
    isAuthenticated,
    isLoading: isLoading || isWalletConnecting,
    user: isAuthenticated ? user : undefined,
  };
}

export function useLogout() {
  const qc = useQueryClient();
  const { disconnectAsync } = useDisconnect();

  return useMutation({
    mutationFn: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
      await disconnectAsync();
    },
    onSuccess: () => {
      qc.removeQueries({ queryKey: authKeys.all });
    },
  });
}

export function useSiweAuthentication() {
  const { mutateAsync: getNonce, isPending: isGettingNonce } = useGetNonce();
  const { mutateAsync: verifySignature, isPending: isVerifying } =
    useVerifySignature();
  const { signMessageAsync } = useSignMessage();

  const [isSigning, setIsSigning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const qc = useQueryClient();

  const signInWithEthereum = async (
    walletAddress: string
  ): Promise<string | null> => {
    setErrorMessage(null);
    setIsSigning(true);
    try {
      const nonceData = await getNonce({ walletAddress });
      if (!nonceData.message) {
        throw new Error("Missing SIWE message from server");
      }

      const signature = await signMessageAsync({ message: nonceData.message });
      await verifySignature({ message: nonceData.message, signature });
      setIsSigning(false);
      qc.invalidateQueries({
        queryKey: authKeys.me(),
      });

      return null;
    } catch (err: any) {
      const msg = err?.message || "Authentication failed. Please try again.";
      setErrorMessage(msg);
      setIsSigning(false);
      return msg;
    }
  };

  return {
    signInWithEthereum,
    isGettingNonce,
    isVerifying,
    isSigning,
    errorMessage,
  };
}
