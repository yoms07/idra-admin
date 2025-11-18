import { http } from "@/lib/http/client";
import {
  AdminTransactionListResponseSchema,
  type AdminTransactionListParams,
  type AdminTransactionListResponse,
} from "../schema/adminTransaction";

export const adminTransactionService = {
  async listTransactions(
    params?: AdminTransactionListParams
  ): Promise<AdminTransactionListResponse> {
    const res = await http.get("/api/admin/transactions", { params });
    const parsed = AdminTransactionListResponseSchema.parse(res.data);
    return parsed;
  },
};
