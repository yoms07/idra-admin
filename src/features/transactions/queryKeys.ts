import { AdminTransactionListParams } from "./schema/adminTransaction";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (params?: object) => [...transactionKeys.lists(), params] as const,
  infiniteList: (params?: object) =>
    [...transactionKeys.lists(), "infinite", params] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  stats: () => [...transactionKeys.all, "stats"] as const,
  admin: () => [...transactionKeys.all, "admin"] as const,
  adminTransactions: () =>
    [...transactionKeys.admin(), "transactions"] as const,
  adminTransactionsList: (params?: Omit<AdminTransactionListParams, "page">) =>
    [...transactionKeys.adminTransactions(), "list", params] as const,
  adminTransactionsInfiniteList: (
    params?: Omit<AdminTransactionListParams, "page">
  ) => [...transactionKeys.adminTransactions(), "infinite", params] as const,
};
