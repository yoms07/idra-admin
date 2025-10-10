import { http } from "@/lib/http/client";
import {
  SupportedBanksResponseSchema,
  CreateBankAccountRequestSchema,
  CreateBankAccountResponseSchema,
  BankAccountListResponseSchema,
  type SupportedBank,
  type CreateBankAccountRequest,
  type BankAccount,
} from "../schema/bankAccount";

export const bankAccountService = {
  async listBanks(): Promise<SupportedBank[]> {
    const res = await http.get("/api/bank-accounts/banks");
    const parsed = SupportedBanksResponseSchema.parse(res.data);
    return parsed.data;
  },

  async createAccount(input: CreateBankAccountRequest): Promise<BankAccount> {
    const body = CreateBankAccountRequestSchema.parse(input);
    const res = await http.post("/api/bank-accounts", body);
    const parsed = CreateBankAccountResponseSchema.parse(res.data);
    return parsed.data;
  },

  async listAccounts(): Promise<BankAccount[]> {
    const res = await http.get("/api/bank-accounts");
    const parsed = BankAccountListResponseSchema.parse(res.data);
    return parsed.data;
  },
  async deleteAccount(id: string): Promise<void> {
    await http.delete(`/api/bank-accounts/${id}`);
  },
};
