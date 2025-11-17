export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (params?: object) => [...transactionKeys.lists(), params] as const,
  infiniteList: (params?: object) =>
    [...transactionKeys.lists(), "infinite", params] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  stats: () => [...transactionKeys.all, "stats"] as const,
};
