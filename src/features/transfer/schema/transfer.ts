import { z } from "zod";
import { baseResponse } from "@/features/auth/schema/auth";

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

export const CreateTransferResponseSchema = baseResponse(
  z.object({
    transferId: z.string(),
    debited: z
      .object({
        amount: z.string(),
        fees: z.array(TransferFeeSchema).optional().default([]),
      })
      .optional(),
    newBalance: z.string(),
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
export const SupportedChainsResponseSchema = baseResponse(
  z.array(SupportedChainSchema)
);

// Types
export type CreateTransferRequest = z.infer<typeof CreateTransferRequestSchema>;
export type CreateTransferResponse = z.infer<
  typeof CreateTransferResponseSchema
>["data"];
export type Transfer = z.infer<typeof TransferSchema>;
export type SupportedChain = z.infer<typeof SupportedChainSchema>;
