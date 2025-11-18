import { z } from "zod";

// Admin User schema for audit log
export const AuditLogAdminUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
});

// Audit Log schema
export const AuditLogSchema = z.object({
  id: z.string(),
  adminUserId: z.string(),
  adminUser: AuditLogAdminUserSchema,
  action: z.string(),
  resourceType: z.string(),
  resourceId: z.string(),
  metadata: z.record(z.string(), z.any()),
  userAgent: z.string().nullable(),
  status: z.enum(["success", "failed"]),
  errorMessage: z.string().nullable(),
  createdAt: z.string(),
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

// Audit Log List Response
export const AuditLogListResponseSchema = z.object({
  data: z.array(AuditLogSchema),
  pagination: PaginationSchema,
});

// Audit Log List Params
export interface AuditLogListParams {
  page?: number;
  limit?: number;
  action?: string;
  status?: "success" | "failed";
  resourceType?: string;
  adminUserId?: string;
  startDate?: string;
  endDate?: string;
}

// Types
export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AuditLogAdminUser = z.infer<typeof AuditLogAdminUserSchema>;
export type AuditLogListResponse = z.infer<typeof AuditLogListResponseSchema>;
