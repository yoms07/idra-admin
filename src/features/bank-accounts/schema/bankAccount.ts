import { z } from "zod";
import { baseResponse } from "@/lib/response";

export const SupportedBankSchema = z.object({
  currency: z.string(),
  bankCode: z.string(),
  bankName: z.string(),
  minAmount: z.number(),
  maxAmount: z.number(),
  feeFlat: z.number(),
  feePercentage: z.number(),
});

export const SupportedBanksResponseSchema = baseResponse(
  z.array(SupportedBankSchema)
);

export const CreateBankAccountRequestSchema = z.object({
  accountHolderName: z.string().min(1),
  bankCode: z.string().min(1), // server expects code like "bank_central_asia"
  accountNumber: z.string().min(1),
  isDefault: z.boolean().optional().default(false),
});

export const BankAccountSchema = z.object({
  id: z.string(),
  accountHolderName: z.string(),
  accountNumber: z.string(),
  bankCode: z.string(),
  bankName: z.string(),
  accountNumberLast4: z.string(),
  isDefault: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const CreateBankAccountResponseSchema = baseResponse(BankAccountSchema);
export const BankAccountListResponseSchema = baseResponse(
  z.array(BankAccountSchema)
);

export type SupportedBank = z.infer<typeof SupportedBankSchema>;
export type CreateBankAccountRequest = z.infer<
  typeof CreateBankAccountRequestSchema
>;
export type BankAccount = z.infer<typeof BankAccountSchema>;
