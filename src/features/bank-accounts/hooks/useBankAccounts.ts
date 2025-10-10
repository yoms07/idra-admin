import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bankAccountService } from "../services/bankAccountService";
import { bankAccountKeys } from "../queryKeys";
import { type CreateBankAccountRequest } from "../schema/bankAccount";

export function useSupportedBanks() {
  return useQuery({
    queryKey: bankAccountKeys.banks(),
    queryFn: () => bankAccountService.listBanks(),
  });
}

export function useBankAccounts() {
  return useQuery({
    queryKey: bankAccountKeys.accounts(),
    queryFn: () => bankAccountService.listAccounts(),
  });
}

export function useCreateBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBankAccountRequest) =>
      bankAccountService.createAccount(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bankAccountKeys.accounts() });
    },
  });
}

export function useDeleteBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bankAccountService.deleteAccount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bankAccountKeys.accounts() });
    },
  });
}
