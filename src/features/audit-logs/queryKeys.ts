import { AuditLogListParams } from "./schema/auditLog";

export const auditLogKeys = {
  all: ["audit-logs"] as const,
  admin: () => [...auditLogKeys.all, "admin"] as const,
  list: (params?: Omit<AuditLogListParams, "page">) =>
    [...auditLogKeys.admin(), "list", params] as const,
  infiniteList: (params?: Omit<AuditLogListParams, "page">) =>
    [...auditLogKeys.admin(), "infinite", params] as const,
};
