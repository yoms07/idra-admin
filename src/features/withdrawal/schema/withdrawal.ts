import { z } from "zod";
import { baseResponse } from "@/lib/response";

export const CreateWithdrawalRecipientSchema = z.object({
  bankCode: z.string(),
  bankName: z.string(),
  accountName: z.string(),
  accountNumber: z.string(),
});

export const CreateWithdrawalRequestSchema = z.object({
  originalAmount: z.string().min(1, "Amount is required"),
  currency: z.string().default("IDR"),
  recipient: CreateWithdrawalRecipientSchema,
});

export const CreateWithdrawalResponseSchema = baseResponse(
  z.object({
    withdrawalId: z.string(),
    newBalance: z.string(),
  })
);

// Minimal shapes for list/detail; can be expanded later
export const WithdrawalSchema = z.object({
  id: z.string(),
  originalAmount: z.string(),
  inputAmount: z.string(),
  redeemAmount: z.string().optional(),
  currency: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  completedAt: z.string().nullable().optional(),
});

export const WithdrawalResponseSchema = baseResponse(WithdrawalSchema);
export const WithdrawalListResponseSchema = baseResponse(
  z.array(WithdrawalSchema)
);

export const PaymentMethodSchema = z.object({
  bankName: z.string(),
  bankCode: z.string(),
  currency: z.string(),
  minAmount: z.number(),
  maxAmount: z.number(),
  feeFlat: z.number(),
  feePercentage: z.number(),
});

export const PaymentMethodListResponseSchema = baseResponse(
  z.array(PaymentMethodSchema)
);

export const CheckFirstTimeRequestSchema = z.object({
  accountNumber: z.string().min(1, "Account number is required"),
});

export const CheckFirstTimeResponseSchema = baseResponse(
  z.object({
    isFirstTime: z.boolean(),
  })
);

export type CreateWithdrawalRequest = z.infer<
  typeof CreateWithdrawalRequestSchema
>;
export type CreateWithdrawalResponse = z.infer<
  typeof CreateWithdrawalResponseSchema
>["data"];
export type Withdrawal = z.infer<typeof WithdrawalSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type CheckFirstTimeRequest = z.infer<typeof CheckFirstTimeRequestSchema>;
export type CheckFirstTimeResponse = z.infer<
  typeof CheckFirstTimeResponseSchema
>["data"];
