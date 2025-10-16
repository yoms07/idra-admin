import { z } from "zod";
import { PaginationSchema, Currency } from "@/features/mint/schema/mint";
import { baseResponse } from "@/features/auth";

export enum RedeemStatus {
  PENDING = "pending",
  BURNING = "burning",
  BURNED = "burned",
  DISBURSING = "disbursing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum DisburseStatus {
  PENDING = "pending",
  REQUESTED = "requested",
  COMPLETED = "completed",
  EXPIRED = "expired",
  FAILED = "failed",
}

export const DisburseStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const RedeemRecipientSchema = z.object({
  bankCode: z.string(),
  bankName: z.string(),
  accountName: z.string(),
  accountNumber: z.string(),
});

export const RedeemCreateBodySchema = z
  .object({
    fromAddress: z.string().startsWith("0x").length(42),
    originalAmount: z.string().regex(/^\d+(\.\d+)?$/), // in IDRA (1:1)
    inputCurrency: z.enum(Currency).default(Currency.IDRA),
    redeemCurrency: z.enum(Currency).default(Currency.IDR),
    chainId: z.number().int(),
    recipient: z.object({
      bankCode: z.string(),
      bankName: z.string(),
      accountName: z.string(),
      accountNumber: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.inputCurrency !== Currency.IDRA) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only support IDRA as input currency",
      });
    }
    if (data.redeemCurrency !== Currency.IDR) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only support IDR as redeem currency",
      });
    }
    return;
  });

export const CreateRedeemResponseDataSchema = z.object({
  id: z.string(),
  status: z.enum(RedeemStatus),
});
export const CreateRedeemResponseSchema = baseResponse(
  CreateRedeemResponseDataSchema
);

export const RedeemDataSchema = z.object({
  id: z.string(),
  userId: z.string(),
  inputCurrency: z.enum(Currency),
  redeemCurrency: z.enum(Currency),
  originalAmount: z.string(),
  inputAmount: z.string(),
  redeemAmount: z.string(),
  pgFee: z.string(),
  platformFee: z.string(),
  fromAddress: z.string(),
  chainId: z.number(),
  recipientBank: RedeemRecipientSchema,
  burnTxHash: z.string().nullable().optional(),
  disburseStatus: z.enum(DisburseStatus),
  status: z.enum(RedeemStatus),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  bankAccountId: z.string().nullable().optional(),
});

export const RedeemResponseSchema = baseResponse(RedeemDataSchema);
export const RedeemListResponseSchema = z.object({
  data: z.array(RedeemDataSchema),
  pagination: PaginationSchema,
});

export type RedeemRecipient = z.infer<typeof RedeemRecipientSchema>;
export type RedeemCreateBody = z.infer<typeof RedeemCreateBodySchema>;
export type CreateRedeemResponseData = z.infer<
  typeof CreateRedeemResponseDataSchema
>;
export type RedeemData = z.infer<typeof RedeemDataSchema>;
