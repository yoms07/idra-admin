import { z } from "zod";

export type TransactionType =
  | "transfer"
  | "withdraw"
  | "deposit"
  | "onchain_deposit";
export type TransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired";

export const TransactionTypeSchema = z.enum([
  "transfer",
  "withdraw",
  "deposit",
  "onchain_deposit",
]);
export const TransactionStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
  "expired",
]);

// Recipient bank schema for withdraw transactions
export const RecipientBankSchema = z.object({
  bankCode: z.string(),
  bankName: z.string(),
  accountName: z.string(),
  accountNumber: z.string(),
});

// Base transaction schema from API
export const TransactionSchema = z.object({
  id: z.string(),
  type: TransactionTypeSchema,
  status: TransactionStatusSchema,
  amount: z.string(),
  originalAmount: z.string().nullable(),
  inputAmount: z.string().nullable(),
  redeemAmount: z.string().nullable(),
  toAddress: z.string().nullable(),
  transactionHash: z.string().nullable(),
  paymentReference: z.string().nullable(),
  paymentStatus: z.string().nullable(),
  pgFee: z.string().nullable(),
  platformFee: z.string().nullable(),
  currency: z.string(),
  paymentMethod: z.string().nullable(),
  recipientBank: RecipientBankSchema.nullable(),
  chainId: z.number().nullable(),
  mintJobId: z.string().nullable(),
  mintedAt: z.string().nullable(),
  expiresAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  metadata: z.record(z.string(), z.any()).nullable(),
});

export interface UnifiedTransaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  originalAmount: string | null;
  inputAmount: string | null;
  redeemAmount: string | null;
  toAddress: string | null;
  transactionHash: string | null;
  paymentReference: string | null;
  paymentStatus: string | null;
  pgFee: string | null;
  platformFee: string | null;
  currency: string;
  paymentMethod: string | null;
  recipientBank: {
    bankCode: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
  } | null;
  chainId: number | null;
  mintJobId: string | null;
  mintedAt: Date | null;
  expiresAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any> | null;
}

// API Response schemas
export const TransactionResponseSchema = z.object({
  data: TransactionSchema,
});

export const TransactionListResponseSchema = z.object({
  data: z.array(TransactionSchema),
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
  startDate?: string;
  endDate?: string;
}

// TransactionListResponse with converted dates
export type TransactionListResponse = {
  data: UnifiedTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
export type TransactionStatsResponse = z.infer<
  typeof TransactionStatsResponseSchema
>;
