import { z } from "zod";
import { baseResponse } from "@/features/auth/schema/auth";

export const MintMethodSchema = z.enum(["qris", "va_bri", "va_bca", "va_bni"]);

// Mint status and payment status enums
export const MintStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const PaymentStatusSchema = z.enum([
  "waiting_payment",
  "paid",
  "failed",
  "expired",
]);

// Generic pagination schema
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const CreateMintRequestSchema = z.object({
  mintAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amountIdr: z.string().regex(/^\d+$/),
  paymentMethod: MintMethodSchema,
  chainId: z.number(),
});

export const PaymentInstructionsSchema = z.object({
  bankCode: z.string().optional(),
  bankName: z.string().optional(),
  qrData: z.string().optional(),
  accountNumber: z.string().optional(),
});

export const MintDataSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  amount: z.string().optional(),
  amountIdr: z.string(),
  paymentMethod: MintMethodSchema,
  paymentReference: z.string(),
  paymentInstructions: PaymentInstructionsSchema,
  expiresAt: z.string(),
  status: MintStatusSchema,
  paymentStatus: PaymentStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  mintAddress: z.string().optional(),
  readyToMintAt: z.string().nullable().optional(),
  mintedAt: z.string().nullable().optional(),
  adminUserId: z.string().nullable().optional(),
  chainId: z.number().optional(),
  transactionHash: z.string().nullable().optional(),
  fee: z.string().optional(),
});

export const MintResponseSchema = baseResponse(MintDataSchema);

export type MintMethod = z.infer<typeof MintMethodSchema>;
export type CreateMintRequest = z.infer<typeof CreateMintRequestSchema>;
export type MintData = z.infer<typeof MintDataSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
