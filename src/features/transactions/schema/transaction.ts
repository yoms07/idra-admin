import { z } from "zod";

export type TransactionType = "mint" | "redeem";
export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired";

export const TransactionTypeSchema = z.enum([
  "mint",
  "redeem",
  "transfer",
  "burn",
]);
export const TransactionStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
  "expired",
]);

export interface UnifiedTransaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount?: string;
  fromAddress?: string;
  toAddress?: string;
  mintAddress?: string;
  transactionHash?: string;
  burnTxHash?: string;
  chainId: number;
  paymentReference?: string;
  paymentStatus?: string;
  disburseStatus?: string;
  fee?: string;
  networkFee?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  mintedAt?: Date;
  readyToMintAt?: Date;
  expiresAt?: Date;
  metadata?: any;
}

// API Response schemas
export const TransactionResponseSchema = z.object({
  data: z.any(), // We'll validate this as UnifiedTransaction in the service
});

export const TransactionListResponseSchema = z.object({
  data: z.array(z.any()), // We'll validate this as UnifiedTransaction[] in the service
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// Stats schemas
export const TransactionStatsByTypeSchema = z.object({
  total: z.number(),
  amount: z.number(),
  byStatus: z.record(
    z.string(),
    z.object({
      count: z.number(),
      amount: z.number(),
    })
  ),
});

export const TransactionStatsByStatusSchema = z.object({
  total: z.number(),
  amount: z.number(),
  byType: z.record(
    z.string(),
    z.object({
      count: z.number(),
      amount: z.number(),
    })
  ),
});

export const TransactionStatsSchema = z.object({
  byType: z.record(z.string(), TransactionStatsByTypeSchema),
  byStatus: z.record(z.string(), TransactionStatsByStatusSchema),
  total: z.number(),
  totalAmount: z.number(),
});

export const TransactionStatsResponseSchema = z.object({
  data: TransactionStatsSchema,
});

// Request schemas
export interface TransactionListParams {
  page?: number;
  limit?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  fromAddress?: string;
  toAddress?: string;
  mintAddress?: string;
  startDate?: string;
  endDate?: string;
}

export type TransactionListResponse = z.infer<
  typeof TransactionListResponseSchema
>;
export type TransactionStatsResponse = z.infer<
  typeof TransactionStatsResponseSchema
>;
