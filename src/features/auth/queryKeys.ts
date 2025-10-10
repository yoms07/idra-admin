export const authKeys = {
  all: ["auth"] as const,
  nonce: () => [...authKeys.all, "nonce"] as const,
  verify: () => [...authKeys.all, "verify"] as const,
  me: () => [...authKeys.all, "me"] as const,
};
