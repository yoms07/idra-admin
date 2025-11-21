import { useQuery } from "@tanstack/react-query";
import { liquidityService } from "../services/liquidityService";
import { liquidityKeys } from "../queryKeys";

export function useOnchainLiquidity() {
  return useQuery({
    queryKey: liquidityKeys.onchainLiquidity(),
    queryFn: () => liquidityService.getOnchainLiquidity(),
  });
}

export function useGasTanks() {
  return useQuery({
    queryKey: liquidityKeys.gasTanks(),
    queryFn: () => liquidityService.getGasTanks(),
  });
}

export function useDepositStats() {
  return useQuery({
    queryKey: liquidityKeys.depositStats(),
    queryFn: () => liquidityService.getDepositStats(),
  });
}
