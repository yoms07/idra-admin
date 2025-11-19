import { http } from "@/lib/http/client";
import {
  CreateWithdrawalRequestSchema,
  CreateWithdrawalResponseSchema,
  WithdrawalListResponseSchema,
  WithdrawalResponseSchema,
  PaymentMethodListResponseSchema,
  CheckFirstTimeRequestSchema,
  CheckFirstTimeResponseSchema,
  ConfirmWithdrawalRequestSchema,
  ConfirmWithdrawalResponseSchema,
  type CreateWithdrawalRequest,
  type CreateWithdrawalResponse,
  type ConfirmWithdrawalRequest,
  type ConfirmWithdrawalResponse,
  type Withdrawal,
  type PaymentMethod,
  type CheckFirstTimeRequest,
  type CheckFirstTimeResponse,
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

  async confirm(
    input: ConfirmWithdrawalRequest
  ): Promise<ConfirmWithdrawalResponse> {
    const body = ConfirmWithdrawalRequestSchema.parse(input);
    const res = await http.post("/api/wallet/withdrawals/confirm", body);
    const parsed = ConfirmWithdrawalResponseSchema.parse(res.data);
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

  async checkFirstTime(
    input: CheckFirstTimeRequest
  ): Promise<CheckFirstTimeResponse> {
    const body = CheckFirstTimeRequestSchema.parse(input);
    const res = await http.post("/api/wallet/check-first-time", body);
    const parsed = CheckFirstTimeResponseSchema.parse(res.data);
    return parsed.data;
  },
};
