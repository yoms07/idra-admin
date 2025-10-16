import { useMutation, useQuery } from "@tanstack/react-query";
import { redeemService } from "../services/redeemService";
import { type RedeemCreateBody, type RedeemData } from "../schema/redeem";

export function useCreateRedeem() {
  return useMutation({
    mutationFn: (input: RedeemCreateBody) => redeemService.create(input),
  });
}

export function useRedeemList(params?: { page?: number; limit?: number }) {
  return useQuery<{
    items: RedeemData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: ["redeem", "list", params ?? {}],
    queryFn: () => redeemService.list(params),
  });
}

export function useRedeemById(id?: string, refetchIntervalMs?: number) {
  return useQuery<RedeemData>({
    queryKey: ["redeem", { id }],
    queryFn: () => redeemService.getById(id as string),
    enabled: !!id,
    refetchInterval: refetchIntervalMs,
  });
}

export function useEstimateRedeem(input?: RedeemCreateBody) {
  return useQuery({
    queryKey: ["redeem", "estimate", input ?? {}],
    queryFn: () => redeemService.estimate(input as RedeemCreateBody),
    enabled: Boolean(
      input &&
        input.fromAddress &&
        input.originalAmount &&
        input.chainId &&
        input.recipient &&
        input.inputCurrency &&
        input.redeemCurrency
    ),
  });
}
