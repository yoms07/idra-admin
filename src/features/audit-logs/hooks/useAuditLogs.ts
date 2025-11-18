import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { auditLogService } from "../services/auditLogService";
import { auditLogKeys } from "../queryKeys";
import type {
  AuditLogListParams,
  AuditLogListResponse,
} from "../schema/auditLog";

export function useInfiniteAdminAuditLogList(
  params?: Omit<AuditLogListParams, "page">
) {
  return useInfiniteQuery<
    AuditLogListResponse,
    Error,
    InfiniteData<AuditLogListResponse>,
    ReturnType<typeof auditLogKeys.infiniteList>
  >({
    queryKey: auditLogKeys.infiniteList(params),
    queryFn: ({ pageParam = 1 }) =>
      auditLogService.listAuditLogs({
        ...params,
        page: pageParam as number,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const {
        pagination: { page, totalPages },
      } = lastPage;
      return page >= totalPages ? undefined : page + 1;
    },
    getPreviousPageParam: (firstPage) => {
      const {
        pagination: { page },
      } = firstPage;
      return page <= 1 ? undefined : page - 1;
    },
  });
}
