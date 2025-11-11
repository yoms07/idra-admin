import { http } from "@/lib/http/client";
import {
  CreateWithdrawalRequestSchema,
  CreateWithdrawalResponseSchema,
  WithdrawalListResponseSchema,
  WithdrawalResponseSchema,
  PaymentMethodListResponseSchema,
  type CreateWithdrawalRequest,
  type CreateWithdrawalResponse,
  type Withdrawal,
  type PaymentMethod,
} from "../schema/withdrawal";

export const withdrawalService = {
  async create(
    input: CreateWithdrawalRequest
  ): Promise<CreateWithdrawalResponse> {
    const body = CreateWithdrawalRequestSchema.parse(input);
    const res = await http.post("/api/wallet/withdrawals", body);
    const parsed = CreateWithdrawalResponseSchema.parse(res.data);
    return parsed.data;
  },

  async getById(id: string): Promise<Withdrawal> {
    const res = await http.get(`/api/wallet/withdrawals/${id}`);
    const parsed = WithdrawalResponseSchema.parse(res.data);
    return parsed.data;
  },

  async list(params?: {
    limit?: number;
    offset?: number;
  }): Promise<Withdrawal[]> {
    const res = await http.get("/api/wallet/withdrawals", { params });
    const parsed = WithdrawalListResponseSchema.parse(res.data);
    return parsed.data;
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const res = await http.get("/api/wallet/withdrawals-pm");
    const parsed = PaymentMethodListResponseSchema.parse(res.data);
    return parsed.data;
  },
};
