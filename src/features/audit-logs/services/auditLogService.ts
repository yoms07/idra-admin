import { http } from "@/lib/http/client";
import {
  AuditLogListResponseSchema,
  type AuditLogListParams,
  type AuditLogListResponse,
} from "../schema/auditLog";

export const auditLogService = {
  async listAuditLogs(
    params?: AuditLogListParams
  ): Promise<AuditLogListResponse> {
    const res = await http.get("/api/admin/audit-logs", { params });
    const parsed = AuditLogListResponseSchema.parse(res.data);
    return parsed;
  },
};
