import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { transactionService } from "../services/transactionService";
import { transactionKeys } from "../queryKeys";
import {
  type TransactionListParams,
  type TransactionListResponse,
  type TransactionStatsResponse,
} from "../schema/transaction";

export function useTransaction(id?: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id || ""),
    queryFn: () => transactionService.getById(id as string),
    enabled: !!id,
  });
}

export function useTransactionList(params?: TransactionListParams) {
  return useQuery<TransactionListResponse>({
    queryKey: transactionKeys.list(params),
    queryFn: () => transactionService.list(params),
  });
}

export function useInfiniteTransactionList(
  params?: Omit<TransactionListParams, "page">
) {
  return useInfiniteQuery<
    TransactionListResponse,
    Error,
    InfiniteData<TransactionListResponse>,
    ReturnType<typeof transactionKeys.infiniteList>
  >({
    queryKey: transactionKeys.infiniteList(params),
    queryFn: ({ pageParam = 1 }) =>
      transactionService.list({
        ...params,
        page: pageParam as number,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const {
        pagination: { page, totalPages },
      } = lastPage;

      if (page >= totalPages) {
        return undefined;
      }

      return page + 1;
    },
    getPreviousPageParam: (firstPage) => {
      const {
        pagination: { page },
      } = firstPage;

      if (page <= 1) {
        return undefined;
      }

      return page - 1;
    },
  });
}

export function useTransactionStats() {
  return useQuery<TransactionStatsResponse>({
    queryKey: transactionKeys.stats(),
    queryFn: () => transactionService.getStats(),
  });
}
