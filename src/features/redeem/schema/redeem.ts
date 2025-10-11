import { z } from "zod";
import { PaginationSchema } from "@/features/mint/schema/mint";
import { baseResponse } from "@/features/auth";

export const RedeemStatusSchema = z.enum([
  "pending",
  "burning",
  "burned",
  "disbursing",
  "completed",
  "failed",
]);

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

export const CreateRedeemRequestSchema = z.object({
  fromAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amountIdr: z.string().regex(/^\d+$/),
  recipient: RedeemRecipientSchema,
  chainId: z.number().optional(),
});

export const CreateRedeemResponseDataSchema = z.object({
  id: z.string(),
  status: RedeemStatusSchema,
});
export const CreateRedeemResponseSchema = baseResponse(
  CreateRedeemResponseDataSchema
);

export const RedeemDataSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amountIdr: z.string(),
  fromAddress: z.string(),
  chainId: z.number(),
  recipientBank: RedeemRecipientSchema,
  burnTxHash: z.string().nullable().optional(),
  disbursementId: z.string().nullable().optional(),
  disburseStatus: z.string(),
  status: RedeemStatusSchema,
  fee: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const RedeemResponseSchema = baseResponse(RedeemDataSchema);
export const RedeemListResponseSchema = z.object({
  data: z.array(RedeemDataSchema),
  pagination: PaginationSchema,
});

export type RedeemStatus = z.infer<typeof RedeemStatusSchema>;
export type RedeemRecipient = z.infer<typeof RedeemRecipientSchema>;
export type CreateRedeemRequest = z.infer<typeof CreateRedeemRequestSchema>;
export type CreateRedeemResponseData = z.infer<
  typeof CreateRedeemResponseDataSchema
>;
export type RedeemData = z.infer<typeof RedeemDataSchema>;
