export const transferKeys = {
  all: ["transfer"] as const,
  lists: () => [...transferKeys.all, "list"] as const,
  list: (params?: { limit?: number; offset?: number }) =>
    [...transferKeys.lists(), params ?? {}] as const,
  details: () => [...transferKeys.all, "detail"] as const,
  detail: (id: string) => [...transferKeys.details(), { id }] as const,
  chains: () => [...transferKeys.all, "chains"] as const,
};
