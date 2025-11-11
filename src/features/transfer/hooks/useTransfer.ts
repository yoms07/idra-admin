import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transferService } from "../services/transferService";
import { transferKeys } from "../queryKeys";
import {
  type CreateTransferRequest,
  type CreateTransferResponse,
  type Transfer,
  type SupportedChain,
} from "../schema/transfer";

export function useCreateTransfer() {
  const qc = useQueryClient();
  return useMutation<CreateTransferResponse, unknown, CreateTransferRequest>({
    mutationFn: (input) => transferService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: transferKeys.lists() });
    },
  });
}

export function useTransferById(id?: string) {
  return useQuery<Transfer>({
    queryKey: transferKeys.detail(id || ""),
    queryFn: () => transferService.getById(id as string),
    enabled: !!id,
  });
}

export function useTransferList(params?: { limit?: number; offset?: number }) {
  return useQuery<Transfer[]>({
    queryKey: transferKeys.list(params),
    queryFn: () => transferService.list(params),
  });
}

export function useSupportedChains() {
  return useQuery<SupportedChain[]>({
    queryKey: transferKeys.chains(),
    queryFn: () => transferService.getChains(),
  });
}
