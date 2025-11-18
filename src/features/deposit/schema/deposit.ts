import { z } from "zod";
import { baseResponse } from "@/lib/response";

export enum PaymentStatus {
  WAITING_PAYMENT = "waiting_payment",
  COMPLETED = "completed",
  FAILED = "failed",
  EXPIRED = "expired",
}

export const CreateDepositRequestSchema = z.object({
  originalAmount: z.string().min(1, "Amount is required"),
  currency: z.string().default("IDR"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

export const QRISPaymentInstructionsSchema = z.object({
  qrData: z.string(),
  bankCode: z.string(),
  bankName: z.string(),
});

export const VAPaymentInstructionsSchema = z.object({
  accountNumber: z.string(),
  bankCode: z.string(),
  bankName: z.string(),
});

export const PaymentInstructionsSchema = z.union([
  QRISPaymentInstructionsSchema,
  VAPaymentInstructionsSchema,
]);

const BaseDepositSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.string(),
  originalAmount: z.string(),
  inputAmount: z.string(),
  pgFee: z.string(),
  platformFee: z.string(),
  currency: z.string(),
  paymentMethod: z.string(),
  paymentReference: z.string(),
  paymentInstructions: PaymentInstructionsSchema,
  paymentStatus: z.enum([
    PaymentStatus.WAITING_PAYMENT,
    PaymentStatus.COMPLETED,
    PaymentStatus.FAILED,
    PaymentStatus.EXPIRED,
  ]),
  expiresAt: z.string(),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const DepositDataSchema = BaseDepositSchema;

export const DepositPaymentMethodSchema = z.object({
  depositPaymentType: z.string(),
  bankName: z.string(),
  bankCode: z.string(),
  currency: z.string(),
  minimumAmount: z.number(),
  maximumAmount: z.number(),
  image: z.string().url(),
  feeFlat: z.number(),
  feePercent: z.number(),
});

export const DepositResponseSchema = baseResponse(DepositDataSchema);
export const DepositListResponseSchema = baseResponse(
  z.array(DepositDataSchema)
);
export const DepositPaymentMethodListResponseSchema = baseResponse(
  z.array(DepositPaymentMethodSchema)
);

export type CreateDepositRequest = z.infer<typeof CreateDepositRequestSchema>;
export type DepositData = z.infer<typeof DepositDataSchema>;
export type QRISPaymentInstructions = z.infer<
  typeof QRISPaymentInstructionsSchema
>;
export type VAPaymentInstructions = z.infer<typeof VAPaymentInstructionsSchema>;
export type PaymentInstructions = z.infer<typeof PaymentInstructionsSchema>;
export type DepoistPaymentMethod = z.infer<typeof DepositPaymentMethodSchema>;
