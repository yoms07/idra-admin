export const liquidityKeys = {
  all: ["liquidity"] as const,
  onchainLiquidity: () => [...liquidityKeys.all, "onchain-liquidity"] as const,
  gasTanks: () => [...liquidityKeys.all, "gas-tanks"] as const,
  depositStats: () => [...liquidityKeys.all, "deposit-stats"] as const,
};
