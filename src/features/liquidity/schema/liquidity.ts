import { z } from "zod";
import { baseResponse } from "@/lib/response";

export const ChainLiquidityItemSchema = z.object({
  chainId: z.number(),
  chainName: z.string(),
  chainSlug: z.string(),
  balance: z.string(),
  walletAddress: z.string().nullable(),
  error: z.string().nullable(),
});

export const LiquidityResponseSchema = z.object({
  data: z.array(ChainLiquidityItemSchema),
});

export const DepositStatsResponseSchema = baseResponse(
  z.object({
    totalOffchainBalance: z.string(),
    totalPendingDeposits: z.string(),
  })
);

export type ChainLiquidityItem = z.infer<typeof ChainLiquidityItemSchema>;
export type LiquidityResponse = z.infer<typeof LiquidityResponseSchema>;
export type DepositStatsResponse = z.infer<typeof DepositStatsResponseSchema>;
