export const bankAccountKeys = {
  all: ["bankAccounts"] as const,
  banks: () => [...bankAccountKeys.all, "banks"] as const,
  accounts: () => [...bankAccountKeys.all, "accounts"] as const,
};
