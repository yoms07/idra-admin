import { useMutation, useQuery } from "@tanstack/react-query";
import { redeemService } from "../services/redeemService";
import { type CreateRedeemRequest, type RedeemData } from "../schema/redeem";

export function useCreateRedeem() {
  return useMutation({
    mutationFn: (input: CreateRedeemRequest) => redeemService.create(input),
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
