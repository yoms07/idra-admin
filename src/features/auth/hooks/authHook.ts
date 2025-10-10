import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSignMessage } from "wagmi";
import { authKeys } from "../queryKeys";
import { authService } from "../services/authService";
import { type NonceRequest, type VerifyRequest } from "../schema/auth";

/**
 * Hook to get nonce for wallet authentication
 * This is typically used to initiate the SIWE flow
 */
export function useGetNonce() {
  return useMutation({
    mutationFn: (request: NonceRequest) => authService.getNonce(request),
  });
}

/**
 * Hook to verify SIWE signature
 * This completes the authentication flow
 */
export function useVerifySignature() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (request: VerifyRequest) => authService.verify(request),
    onSuccess: (data) => {
      // Store the auth token
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token);
      }

      // Invalidate auth queries to refresh user state
      qc.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

/**
 * Hook to get current user profile
 * This fetches the authenticated user's information
 */
export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authService.getMe(),
    retry: false, // Don't retry on auth failures
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

/**
 * Hook to check if user is authenticated
 * Returns boolean based on successful user data fetch
 */
export function useIsAuthenticated() {
  const { data: user, isLoading, error } = useMe();
  console.log({ user, error });
  return {
    isAuthenticated: !!user && !error,
    isLoading,
    user,
  };
}

/**
 * Hook to logout user
 * This clears the auth token and invalidates queries
 */
export function useLogout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Clear stored auth token
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    },
    onSuccess: () => {
      // Clear all auth-related queries
      qc.removeQueries({ queryKey: authKeys.all });
    },
  });
}

/**
 * Hook that encapsulates SIWE authentication flow.
 * Returns an action to trigger sign-in with Ethereum and useful status flags.
 */
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
