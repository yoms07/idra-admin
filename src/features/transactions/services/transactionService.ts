import { http } from "@/lib/http/client";
import {
  TransactionResponseSchema,
  TransactionListResponseSchema,
  TransactionStatsResponseSchema,
  type TransactionListParams,
  type TransactionListResponse,
  type TransactionStatsResponse,
  type UnifiedTransaction,
} from "../schema/transaction";

export const transactionService = {
  async getById(id: string): Promise<UnifiedTransaction> {
    const res = await http.get(`/api/transactions/${id}`);
    const parsed = TransactionResponseSchema.parse(res.data);
    // Convert dates from strings to Date objects
    const transaction = parsed.data as any;
    return {
      ...transaction,
      createdAt: new Date(transaction.createdAt),
      updatedAt: new Date(transaction.updatedAt),
      mintedAt: transaction.mintedAt
        ? new Date(transaction.mintedAt)
        : undefined,
      readyToMintAt: transaction.readyToMintAt
        ? new Date(transaction.readyToMintAt)
        : undefined,
      expiresAt: transaction.expiresAt
        ? new Date(transaction.expiresAt)
        : undefined,
    } as UnifiedTransaction;
  },

  async list(params?: TransactionListParams): Promise<TransactionListResponse> {
    const res = await http.get("/api/transactions", { params });
    const parsed = TransactionListResponseSchema.parse(res.data);
    // Convert dates from strings to Date objects for each transaction
    const transactions = parsed.data.map((transaction: any) => ({
      ...transaction,
      createdAt: new Date(transaction.createdAt),
      updatedAt: new Date(transaction.updatedAt),
      mintedAt: transaction.mintedAt
        ? new Date(transaction.mintedAt)
        : undefined,
      readyToMintAt: transaction.readyToMintAt
        ? new Date(transaction.readyToMintAt)
        : undefined,
      expiresAt: transaction.expiresAt
        ? new Date(transaction.expiresAt)
        : undefined,
    })) as UnifiedTransaction[];

    return {
      data: transactions,
      pagination: parsed.pagination,
    };
  },

  async getStats(): Promise<TransactionStatsResponse> {
    const res = await http.get("/api/transactions/stats");
    const parsed = TransactionStatsResponseSchema.parse(res.data);
    return parsed;
  },
};
