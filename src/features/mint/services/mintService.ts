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

export const mintService = {
  async create(input: CreateMintRequest): Promise<MintData> {
    const res = await http.post("/api/mint", input);
    const parsed = MintResponseSchema.parse(res.data);
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
