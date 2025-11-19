import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { withdrawalService } from "../services/withdrawalService";
import { withdrawalKeys } from "../queryKeys";
import {
  type CreateWithdrawalRequest,
  type CreateWithdrawalResponse,
  type ConfirmWithdrawalRequest,
  type ConfirmWithdrawalResponse,
  type Withdrawal,
  type PaymentMethod,
  type CheckFirstTimeResponse,
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

export function useConfirmWithdrawal() {
  const qc = useQueryClient();
  return useMutation<
    ConfirmWithdrawalResponse,
    unknown,
    ConfirmWithdrawalRequest
  >({
    mutationFn: (input) => withdrawalService.confirm(input),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: withdrawalKeys.lists() });
      if (variables.withdrawalId) {
        qc.invalidateQueries({
          queryKey: withdrawalKeys.detail(variables.withdrawalId),
        });
      }
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
    queryKey: withdrawalKeys.paymentMethods(),
    queryFn: () => withdrawalService.getPaymentMethods(),
  });
}

export function useCheckFirstTime(accountNumber?: string) {
  return useQuery<CheckFirstTimeResponse>({
    queryKey: withdrawalKeys.checkFirstTime(accountNumber),
    queryFn: () =>
      withdrawalService.checkFirstTime({ accountNumber: accountNumber! }),
    enabled: !!accountNumber,
  });
}
