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
    queryKey: mintKeys.detail(id || ("" as any)),
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
