export const withdrawalKeys = {
  all: ["withdrawal"] as const,
  lists: () => [...withdrawalKeys.all, "list"] as const,
  list: (params?: { limit?: number; offset?: number }) =>
    [...withdrawalKeys.lists(), params ?? {}] as const,
  details: () => [...withdrawalKeys.all, "detail"] as const,
  detail: (id: string) => [...withdrawalKeys.details(), { id }] as const,
};
