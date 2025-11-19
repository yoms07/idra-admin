import { z } from "zod";
import { baseResponse } from "@/lib/response";

// Create Transfer
export const CreateTransferRequestSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  toAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  chainId: z.number(),
});

export const TransferFeeSchema = z.object({
  type: z.string(),
  amount: z.string(),
  currency: z.string(),
  paidBy: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const OtpMetaSchema = z.object({
  id: z.string(),
  expiresInMinutes: z.number(),
  maxAttempts: z.number(),
  sent: z.boolean(),
});

export const TransferQuoteSchema = z.object({
  amount: z.string(),
  fees: z.array(TransferFeeSchema).optional().default([]),
  totalUserDebit: z.string(),
});

export const DebitedSummarySchema = z.object({
  amount: z.string(),
  fees: z.array(TransferFeeSchema).optional().default([]),
});

export const CreateTransferResponseSchema = baseResponse(
  z.object({
    transferId: z.string(),
    requiresOtp: z.boolean().default(true),
    otp: OtpMetaSchema.optional(),
    quote: TransferQuoteSchema.optional(),
  })
);

export const TransferSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.string(),
  toAddress: z.string(),
  chainId: z.number(),
  status: z.enum(["pending", "queued", "minting", "completed", "failed"]),
  mintJobId: z.string().optional().nullable(),
  transactionHash: z.string().optional().nullable(),
  mintedAt: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  transferFees: z.array(TransferFeeSchema).optional().default([]),
});

export const TransferResponseSchema = baseResponse(TransferSchema);
export const TransferListResponseSchema = baseResponse(z.array(TransferSchema));

// Confirm transfer
export const ConfirmTransferRequestSchema = z.object({
  transferId: z.string().min(1, "Transfer ID is required"),
  otpId: z.string().min(1, "OTP ID is required"),
  code: z.string().min(4, "OTP code is required"),
});

export const ConfirmTransferResponseSchema = baseResponse(
  z.object({
    transferId: z.string(),
    debited: DebitedSummarySchema.optional(),
    newBalance: z.string(),
    status: TransferSchema.shape.status,
  })
);

// Supported chains
export const SupportedChainSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  supportMint: z.boolean(),
  isTestnet: z.boolean(),
  rpcUrl: z.string().nullable(),
  explorerUrl: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TransferOtpErrorResponseSchema = z.object({
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
export const SupportedChainsResponseSchema = baseResponse(
  z.array(SupportedChainSchema)
);

// Check first time address
export const CheckFirstTimeAddressRequestSchema = z.object({
  address: z.string().min(1, "Address is required"),
});

export const CheckFirstTimeAddressResponseSchema = baseResponse(
  z.object({
    isFirstTime: z.boolean(),
  })
);

// Types
export type CreateTransferRequest = z.infer<typeof CreateTransferRequestSchema>;
export type CreateTransferResponse = z.infer<
  typeof CreateTransferResponseSchema
>["data"];
export type ConfirmTransferRequest = z.infer<
  typeof ConfirmTransferRequestSchema
>;
export type ConfirmTransferResponse = z.infer<
  typeof ConfirmTransferResponseSchema
>["data"];
export type TransferOtpErrorResponse = z.infer<
  typeof TransferOtpErrorResponseSchema
>;
export type Transfer = z.infer<typeof TransferSchema>;
export type SupportedChain = z.infer<typeof SupportedChainSchema>;
export type CheckFirstTimeAddressRequest = z.infer<
  typeof CheckFirstTimeAddressRequestSchema
>;
export type CheckFirstTimeAddressResponse = z.infer<
  typeof CheckFirstTimeAddressResponseSchema
>["data"];
