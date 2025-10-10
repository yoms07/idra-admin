export const mintKeys = {
  all: ["mint"] as const,
  lists: () => [...mintKeys.all, "list"] as const,
  list: (params?: {
    status?: string;
    paymentStatus?: string;
    limit?: number;
    page?: number;
  }) => [...mintKeys.lists(), params ?? {}] as const,
  details: () => [...mintKeys.all, "detail"] as const,
  detail: (id: string) => [...mintKeys.details(), { id }] as const,
};
