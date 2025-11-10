import { http } from "@/lib/http/client";
import {
  CreateDepositRequestSchema,
  DepositResponseSchema,
  DepositListResponseSchema,
  type CreateDepositRequest,
  type DepositData,
  DepoistPaymentMethod,
  DepositPaymentMethodListResponseSchema,
} from "../schema/deposit";

export const depositService = {
  async create(request: CreateDepositRequest): Promise<DepositData> {
    const body = CreateDepositRequestSchema.parse(request);
    const res = await http.post("/api/wallet/deposits", body);
    console.log(res.data);
    const parsedResponse = DepositResponseSchema.parse(res.data);
    return parsedResponse.data;
  },

  async getById(id: string): Promise<DepositData> {
    const res = await http.get(`/api/wallet/deposits/${id}`);
    const parsedResponse = DepositResponseSchema.parse(res.data);
    return parsedResponse.data;
  },

  async list(params?: {
    limit?: number;
    offset?: number;
  }): Promise<DepositData[]> {
    const res = await http.get("/api/wallet/deposits", { params });
    const parsedResponse = DepositListResponseSchema.parse(res.data);
    return parsedResponse.data;
  },

  async listPaymentMethod(): Promise<DepoistPaymentMethod[]> {
    const res = await http.get("/api/wallet/deposit-pm");
    const parsedResponse = DepositPaymentMethodListResponseSchema.parse(
      res.data
    );
    return parsedResponse.data;
  },
};
