import { http } from "@/lib/http/client";
import {
  CreateRedeemRequestSchema,
  CreateRedeemResponseSchema,
  RedeemListResponseSchema,
  RedeemResponseSchema,
  type CreateRedeemRequest,
  type RedeemData,
} from "../schema/redeem";

export const redeemService = {
  async create(
    input: CreateRedeemRequest
  ): Promise<{ id: string; status: string }> {
    const body = CreateRedeemRequestSchema.parse(input);
    const res = await http.post("/api/redeem", body);
    const parsed = CreateRedeemResponseSchema.parse(res.data);
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
