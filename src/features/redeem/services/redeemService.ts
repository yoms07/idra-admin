import { http } from "@/lib/http/client";
import {
  CreateRedeemResponseSchema,
  RedeemCreateBody,
  RedeemCreateBodySchema,
  RedeemListResponseSchema,
  RedeemResponseSchema,
  type RedeemData,
} from "../schema/redeem";
import { Currency } from "@/features/mint/schema/mint";
import { z } from "zod";

export const redeemService = {
  async create(
    input: RedeemCreateBody
  ): Promise<{ id: string; status: string }> {
    const res = await http.post("/api/redeem", input);
    const parsed = CreateRedeemResponseSchema.parse(res.data);
    return parsed.data;
  },
  async estimate(input: RedeemCreateBody): Promise<{
    originalAmount: string;
    inputCurrency: Currency;
    redeemCurrency: Currency;
    inputAmount: string;
    redeemAmount: string;
    pgFee: string;
    platformFee: string;
  }> {
    const res = await http.post("/api/redeem/estimate", input);
    const CurrencySchema = z.enum(Currency);
    const EstimateSchema = z.object({
      originalAmount: z.string(),
      inputCurrency: CurrencySchema,
      redeemCurrency: CurrencySchema,
      inputAmount: z.string(),
      redeemAmount: z.string(),
      pgFee: z.string(),
      platformFee: z.string(),
    });
    const EstimateResponseSchema = z.object({ data: EstimateSchema });
    const parsed = EstimateResponseSchema.parse(res.data);
    return parsed.data;
  },
  async list(params?: { page?: number; limit?: number }): Promise<{
    items: RedeemData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const res = await http.get("/api/redeem", { params });
    const parsed = RedeemListResponseSchema.parse(res.data);
    return { items: parsed.data, pagination: parsed.pagination };
  },
  async getById(id: string): Promise<RedeemData> {
    const res = await http.get(`/api/redeem/${id}`);
    const parsed = RedeemResponseSchema.parse(res.data);
    return parsed.data;
  },
};
