import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { userKeys } from "../queryKeys";
import type { WalletAddresses } from "../schema/user";

export function useWalletAddresses() {
  return useQuery<WalletAddresses>({
    queryKey: userKeys.walletAddresses(),
    queryFn: () => userService.getWalletAddresses(),
  });
}
