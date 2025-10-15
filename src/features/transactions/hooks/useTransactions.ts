import { useQuery } from "@tanstack/react-query";
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

export function useTransactionStats() {
  return useQuery<TransactionStatsResponse>({
    queryKey: transactionKeys.stats(),
    queryFn: () => transactionService.getStats(),
  });
}
