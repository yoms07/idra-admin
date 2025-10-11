import { useMemo } from "react";
import { erc20Abi, formatUnits } from "viem";
import { useAccount, useChainId, useReadContracts } from "wagmi";

const DEFAULT_IDRA_TOKEN_ADDRESS =
  "0x1406B94f5fc0Deb701e8e56Ee4d104eD0136ef85" as const;

type UseIDRABalanceParams = {
  chainId?: number;
  tokenAddress?: `0x${string}`;
  walletAddress?: `0x${string}`;
};

export function useIDRABalance(params?: UseIDRABalanceParams) {
  const chainIdFromHook = useChainId();
  const { address: accountAddress } = useAccount();

  const chainId = params?.chainId ?? chainIdFromHook;
  const tokenAddress = (params?.tokenAddress ??
    DEFAULT_IDRA_TOKEN_ADDRESS) as `0x${string}`;
  const walletAddress = (params?.walletAddress ?? accountAddress) as
    | `0x${string}`
    | undefined;

  const enabled = Boolean(chainId && tokenAddress && walletAddress);

  const { data, isLoading, isFetching, error, refetch } = useReadContracts({
    query: { enabled },
    allowFailure: false,
    contracts: [
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "decimals",
        chainId,
      },
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: walletAddress ? [walletAddress] : undefined,
        chainId,
      },
    ],
  });

  const { decimals, balance, formatted } = useMemo(() => {
    if (!data)
      return {
        decimals: undefined as number | undefined,
        balance: undefined as bigint | undefined,
        formatted: undefined as string | undefined,
      };
    const [dec] = data as unknown as [number, bigint];
    const bal = (data as unknown as [number, bigint])[1];
    const fmt = formatUnits(bal, dec);
    return { decimals: dec, balance: bal, formatted: fmt };
  }, [data]);

  return {
    chainId,
    tokenAddress,
    walletAddress,
    decimals,
    balance,
    formatted,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  };
}
