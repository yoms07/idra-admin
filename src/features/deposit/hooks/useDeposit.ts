import { useMutation, useQuery } from "@tanstack/react-query";
import { depositService } from "../services/depositService";
import { depositKeys } from "../queryKeys";
import {
  type CreateDepositRequest,
  type DepositData,
  type DepoistPaymentMethod,
} from "../schema/deposit";

export function useCreateDeposit() {
  return useMutation({
    mutationFn: (request: CreateDepositRequest) =>
      depositService.create(request),
  });
}

export function useDepositById(
  id?: string,
  options?: { refetchInterval?: number }
) {
  return useQuery({
    queryKey: depositKeys.detail(id || ""),
    queryFn: () => depositService.getById(id as string),
    enabled: !!id,
    refetchInterval: options?.refetchInterval,
  });
}

export function useDepositList(params?: { limit?: number; offset?: number }) {
  return useQuery<DepositData[]>({
    queryKey: depositKeys.list(params),
    queryFn: () => depositService.list(params),
  });
}

export function usePaymentMethods() {
  return useQuery<DepoistPaymentMethod[]>({
    queryKey: depositKeys.paymentMethods(),
    queryFn: () => depositService.listPaymentMethod(),
  });
}
