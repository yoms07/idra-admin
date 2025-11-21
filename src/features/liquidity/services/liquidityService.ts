import { http } from "@/lib/http/client";
import {
  LiquidityResponseSchema,
  DepositStatsResponseSchema,
  type LiquidityResponse,
  type DepositStatsResponse,
} from "../schema/liquidity";

export const liquidityService = {
  async getOnchainLiquidity(): Promise<LiquidityResponse> {
    const res = await http.get("/api/admin/wallet/onchain-liquidity");
    const parsed = LiquidityResponseSchema.parse(res.data);
    return parsed;
  },

  async getGasTanks(): Promise<LiquidityResponse> {
    const res = await http.get("/api/admin/wallet/gas-tanks");
    const parsed = LiquidityResponseSchema.parse(res.data);
    return parsed;
  },

  async getDepositStats(): Promise<DepositStatsResponse> {
    const res = await http.get("/api/admin/wallet/deposits-stats");
    const parsed = DepositStatsResponseSchema.parse(res.data);
    return parsed;
  },
};
