import { useMutation, useQuery } from "@tanstack/react-query";
import { mintService } from "../services/mintService";
import { mintKeys } from "../queryKeys";
import {
  type CreateMintRequest,
  type MintData,
  type Pagination,
} from "../schema/mint";

export function useCreateMint() {
  return useMutation({
    mutationFn: (input: CreateMintRequest) => mintService.create(input),
  });
}

export function useMintById(id?: string, fetchInterval?: number) {
  return useQuery({
    queryKey: mintKeys.detail(id || ""),
    queryFn: () => mintService.getById(id as string),
    enabled: !!id,
    refetchInterval: fetchInterval,
  });
}

export function useMintList(params?: {
  status?: string;
  paymentStatus?: string;
  limit?: number;
  page?: number;
}) {
  return useQuery<{ items: MintData[]; pagination: Pagination }>({
    queryKey: mintKeys.list(params),
    queryFn: () => mintService.listMint(params),
  });
}

export function useEstimateMint(input?: CreateMintRequest) {
  return useQuery({
    queryKey: mintKeys.estimate(input),
    queryFn: () => mintService.estimate(input as CreateMintRequest),
    enabled: Boolean(
      input &&
        input.mintAddress &&
        input.paymentMethod &&
        input.chainId &&
        input.originalAmount
    ),
  });
}
