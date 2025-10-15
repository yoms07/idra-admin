import { http } from "@/lib/http/client";
import {
  CreateMintRequestSchema,
  MintResponseSchema,
  type CreateMintRequest,
  type MintData,
} from "../schema/mint";
import { z } from "zod";
import {
  MintDataSchema,
  PaginationSchema,
  type Pagination,
} from "../schema/mint";
import { Currency } from "@/app/api/mint";

export const mintService = {
  async create(input: CreateMintRequest): Promise<MintData> {
    const res = await http.post("/api/mint", input);
    const parsed = MintResponseSchema.parse(res.data);
    return parsed.data;
  },
  async estimate(input: CreateMintRequest): Promise<{
    originalAmount: string;
    inputCurrency: Currency;
    mintCurrency: Currency;
    inputAmount: string;
    mintAmount: string;
    pgFee: string;
    platformFee: string;
  }> {
    const res = await http.post("/api/mint/estimate", input);
    const CurrencySchema = z.enum(Currency);
    const EstimateSchema = z.object({
      originalAmount: z.string(),
      inputCurrency: CurrencySchema,
      mintCurrency: CurrencySchema,
      inputAmount: z.string(),
      mintAmount: z.string(),
      pgFee: z.string(),
      platformFee: z.string(),
    });
    const EstimateResponseSchema = z.object({ data: EstimateSchema });
    const parsed = EstimateResponseSchema.parse(res.data);
    return parsed.data;
  },

  async getById(id: string): Promise<MintData> {
    const res = await http.get(`/api/mint/${id}`);
    const parsed = MintResponseSchema.parse(res.data);
    return parsed.data;
  },
  async listMint(params?: {
    status?: string;
    paymentStatus?: string;
    limit?: number;
    page?: number;
  }): Promise<{ items: MintData[]; pagination: Pagination }> {
    const res = await http.get(`/api/mint`, { params });
    const ListSchema = z.object({
      data: z.array(MintDataSchema),
      pagination: PaginationSchema,
    });
    const data = ListSchema.parse(res.data);
    return { items: data.data, pagination: data.pagination };
  },
};
