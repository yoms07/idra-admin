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

export const WithdrawalOtpMetaSchema = z.object({
  id: z.string(),
  expiresInMinutes: z.number(),
  maxAttempts: z.number(),
  sent: z.boolean(),
});

export const WithdrawalSummarySchema = z.object({
  originalAmount: z.string(),
  totalDebit: z.string(),
  pgFee: z.string(),
  platformFee: z.string(),
});

export const CreateWithdrawalResponseSchema = baseResponse(
  z.object({
    withdrawalId: z.string(),
    requiresOtp: z.boolean().default(true),
    otp: WithdrawalOtpMetaSchema.optional(),
    summary: WithdrawalSummarySchema.optional(),
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

export const ConfirmWithdrawalRequestSchema = z.object({
  withdrawalId: z.string().min(1, "Withdrawal ID is required"),
  otpId: z.string().min(1, "OTP ID is required"),
  code: z.string().min(4, "OTP code is required"),
});

export const ConfirmWithdrawalResponseSchema = baseResponse(
  z.object({
    withdrawalId: z.string(),
    newBalance: z.string(),
    status: WithdrawalSchema.shape.status,
  })
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

export const WithdrawalOtpErrorResponseSchema = z.object({
  error: z
    .object({
      code: z.string().optional(),
      message: z.string().optional(),
      details: z
        .object({
          remainingAttempts: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
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
export type ConfirmWithdrawalRequest = z.infer<
  typeof ConfirmWithdrawalRequestSchema
>;
export type ConfirmWithdrawalResponse = z.infer<
  typeof ConfirmWithdrawalResponseSchema
>["data"];
export type WithdrawalOtpErrorResponse = z.infer<
  typeof WithdrawalOtpErrorResponseSchema
>;
export type Withdrawal = z.infer<typeof WithdrawalSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type CheckFirstTimeRequest = z.infer<typeof CheckFirstTimeRequestSchema>;
export type CheckFirstTimeResponse = z.infer<
  typeof CheckFirstTimeResponseSchema
>["data"];
