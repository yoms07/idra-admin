import { AdminUserListParams } from "./schema/adminUser";

export const userKeys = {
  all: ["user"] as const,
  walletAddresses: () => [...userKeys.all, "wallet-addresses"] as const,
  admin: () => [...userKeys.all, "admin"] as const,
  adminUsers: () => [...userKeys.admin(), "users"] as const,
  adminUsersList: (params?: Omit<AdminUserListParams, "page">) =>
    [...userKeys.adminUsers(), "list", params] as const,
  adminUsersInfiniteList: (params?: Omit<AdminUserListParams, "page">) =>
    [...userKeys.adminUsers(), "infinite", params] as const,
  adminUserChainBalances: (userId: string) =>
    [...userKeys.adminUsers(), "chain-balances", userId] as const,
};
