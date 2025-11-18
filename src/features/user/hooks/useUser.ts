import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { userService } from "../services/userService";
import { userKeys } from "../queryKeys";
import type { WalletAddresses } from "../schema/user";
import { adminUserService } from "../services/adminUserService";
import type {
  AdminUserListParams,
  AdminUserListResponse,
} from "../schema/adminUser";

export function useWalletAddresses() {
  return useQuery<WalletAddresses>({
    queryKey: userKeys.walletAddresses(),
    queryFn: () => userService.getWalletAddresses(),
  });
}

export function useInfiniteAdminUserList(
  params?: Omit<AdminUserListParams, "page">
) {
  return useInfiniteQuery<
    AdminUserListResponse,
    Error,
    InfiniteData<AdminUserListResponse>,
    ReturnType<typeof userKeys.adminUsersInfiniteList>
  >({
    queryKey: userKeys.adminUsersInfiniteList(params),
    queryFn: ({ pageParam = 1 }) =>
      adminUserService.listUsers({
        ...params,
        page: pageParam as number,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const {
        pagination: { page, totalPages },
      } = lastPage;
      return page >= totalPages ? undefined : page + 1;
    },
    getPreviousPageParam: (firstPage) => {
      const {
        pagination: { page },
      } = firstPage;
      return page <= 1 ? undefined : page - 1;
    },
  });
}

export function useVerifyUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminUserService.verifyUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.adminUsers() });
    },
  });
}

export function useUnverifyUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminUserService.unverifyUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.adminUsers() });
    },
  });
}

export function useUserChainBalances(userId: string | undefined) {
  return useQuery({
    queryKey: userKeys.adminUserChainBalances(userId ?? ""),
    queryFn: () => adminUserService.getUserChainBalances(userId!),
    enabled: Boolean(userId),
  });
}

export function useSyncOnchainBalance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: string; chainId: number }) =>
      adminUserService.syncOnchainBalance(params),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: userKeys.adminUserChainBalances(variables.userId),
      });
    },
  });
}

export function usePullIdra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      userId: string;
      chainId: number;
      amount: string;
      recipientAddress: string;
    }) => adminUserService.pullIdra(params),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: userKeys.adminUserChainBalances(variables.userId),
      });
    },
  });
}
