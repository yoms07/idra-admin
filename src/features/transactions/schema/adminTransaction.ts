import { z } from "zod";
import { TransactionSchema } from "./transaction";

// Admin Transaction schema (includes user info)
export const AdminTransactionSchema = TransactionSchema.extend({
  userId: z.string(),
  userEmail: z.string(),
  userName: z.string(),
  userBalance: z.string().optional(),
  onchainBalance: z.string().optional(),
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

// Admin Transaction List Response
export const AdminTransactionListResponseSchema = z.object({
  data: z.array(AdminTransactionSchema),
  pagination: PaginationSchema,
});

// Admin Transaction List Params
export interface AdminTransactionListParams {
  page?: number;
  limit?: number;
  type?: "deposit" | "transfer" | "withdraw" | "onchain_deposit";
  status?: "pending" | "processing" | "completed" | "failed";
  userId?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
}

// Types
export type AdminTransaction = z.infer<typeof AdminTransactionSchema>;
export type AdminTransactionListResponse = z.infer<
  typeof AdminTransactionListResponseSchema
>;
