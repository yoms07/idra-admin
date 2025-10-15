import { z } from "zod";
import { baseResponse } from "@/features/auth/schema/auth";

export enum MintStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum PaymentStatus {
  WAITING_PAYMENT = "waiting_payment",
  COMPLETED = "completed",
  FAILED = "failed",
  EXPIRED = "expired",
}

export enum PaymentMethod {
  QRIS = "qris",
  VA_BNI = "va_bni",
  VA_BRI = "va_bri",
}

export enum Currency {
  IDR = "IDR",
  IDRA = "IDRA",
  USD = "USD",
  USDT = "USDT",
}

export const MintMethodSchema = z.enum([
  "qris",
  "va_bri",
  "va_permata",
  "va_bni",
]);

// Mint status and payment status enums
export const MintStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const PaymentStatusSchema = z.enum([
  "completed",
  "paid", // old value
  "waiting_payment",
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

export const CreateMintRequestSchema = z
  .object({
    mintAddress: z.string(),
    originalAmount: z.string(),
    inputCurrency: z.enum(Currency).default(Currency.IDR),
    mintCurrency: z.enum(Currency).default(Currency.IDRA),
    paymentMethod: z.enum(PaymentMethod),
    chainId: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.inputCurrency !== Currency.IDR) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only support IDR as input currency",
      });
    }
    if (data.mintCurrency !== Currency.IDRA) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only support IDRA as mint currency",
      });
    }
    return;
  });

const BaseMintSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  // currencies and rates
  inputCurrency: z.enum(Currency),
  outputCurrency: z.enum(Currency),
  mintCurrency: z.enum(Currency),
  fxRate: z.string(),
  // amounts and fees
  inputAmount: z.string(),
  outputAmount: z.string(),
  mintAmount: z.string(),
  pgFee: z.string(),
  platformFee: z.string(),
  originalAmount: z.string(),

  paymentReference: z.string(),
  expiresAt: z.string(),
  status: z.enum(MintStatus),
  paymentStatus: z.enum(PaymentStatus),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  mintAddress: z.string().optional(),
  readyToMintAt: z.string().nullable().optional(),
  mintedAt: z.string().nullable().optional(),
  adminUserId: z.string().nullable().optional(),
  chainId: z.number().optional(),
  transactionHash: z.string().nullable().optional(),
});

export const QRISPaymentInstructionsSchema = z.object({
  bankCode: z.string().optional(),
  bankName: z.string().optional(),
  qrData: z.string().optional(),
  accountNumber: z.string().optional(),
});
export const VAPaymentInstructionsSchema = z.object({
  bankCode: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
});

const QRISMintDataSchema = BaseMintSchema.extend({
  paymentMethod: z.literal(PaymentMethod.QRIS),
  paymentInstructions: QRISPaymentInstructionsSchema,
});

const VAMintDataSchema = BaseMintSchema.extend({
  paymentMethod: z.enum([PaymentMethod.VA_BNI, PaymentMethod.VA_BRI]),
  paymentInstructions: VAPaymentInstructionsSchema,
});

export const MintDataSchema = z.discriminatedUnion("paymentMethod", [
  QRISMintDataSchema,
  VAMintDataSchema,
]);
export const MintResponseSchema = baseResponse(MintDataSchema);

export type MintMethod = z.infer<typeof MintMethodSchema>;
export type CreateMintRequest = z.infer<typeof CreateMintRequestSchema>;
export type MintData = z.infer<typeof MintDataSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
