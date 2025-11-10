export const depositKeys = {
  all: ["deposit"] as const,
  lists: () => [...depositKeys.all, "list"] as const,
  list: (params?: { limit?: number; offset?: number }) =>
    [...depositKeys.lists(), params ?? {}] as const,
  details: () => [...depositKeys.all, "detail"] as const,
  detail: (id: string) => [...depositKeys.details(), { id }] as const,
  paymentMethods: () => [...depositKeys.all, "paymentMethods"] as const,
};
