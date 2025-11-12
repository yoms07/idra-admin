export const userKeys = {
  all: ["user"] as const,
  walletAddresses: () => [...userKeys.all, "wallet-addresses"] as const,
};
