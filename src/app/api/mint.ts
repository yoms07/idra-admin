import { z } from "zod";

export enum PaymentMethod {
  QRIS = "qris",
  VA_BNI = "va_bni",
  VA_BRI = "va_bri",
}

export enum Currency {
  IDR = "IDR",
  IDRA = "IDRA",
  USD = "USD",
  USDT = "USDT",
}

export const MintCreateBodySchema = z.object({
  mintAddress: z.string(),
  originalAmount: z.string(),
  inputCurrency: z.enum(Currency).default(Currency.IDR),
  mintCurrency: z.enum(Currency).default(Currency.IDRA),
  paymentMethod: z.enum([
    PaymentMethod.QRIS,
    PaymentMethod.VA_BNI,
    PaymentMethod.VA_BRI,
  ]),
  chainId: z.number(),
});

export type MintCreateBody = z.infer<typeof MintCreateBodySchema>;
