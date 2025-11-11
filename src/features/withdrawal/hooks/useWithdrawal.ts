import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { withdrawalService } from "../services/withdrawalService";
import { withdrawalKeys } from "../queryKeys";
import {
  type CreateWithdrawalRequest,
  type CreateWithdrawalResponse,
  type Withdrawal,
  type PaymentMethod,
} from "../schema/withdrawal";

export function useCreateWithdrawal() {
  const qc = useQueryClient();
  return useMutation<
    CreateWithdrawalResponse,
    unknown,
    CreateWithdrawalRequest
  >({
    mutationFn: (input) => withdrawalService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: withdrawalKeys.lists() });
    },
  });
}

export function useWithdrawalById(id?: string) {
  return useQuery<Withdrawal>({
    queryKey: withdrawalKeys.detail(id || ""),
    queryFn: () => withdrawalService.getById(id as string),
    enabled: !!id,
  });
}

export function useWithdrawalList(params?: {
  limit?: number;
  offset?: number;
}) {
  return useQuery<Withdrawal[]>({
    queryKey: withdrawalKeys.list(params),
    queryFn: () => withdrawalService.list(params),
  });
}

export function usePaymentMethods() {
  return useQuery<PaymentMethod[]>({
    queryKey: [...withdrawalKeys.all, "payment-methods"],
    queryFn: () => withdrawalService.getPaymentMethods(),
  });
}
