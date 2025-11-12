import { z } from "zod";
import { baseResponse } from "@/features/auth/schema/auth";

// Wallet addresses schema
export const WalletAddressesSchema = z.object({
  evmAddress: z.string(),
  btcAddress: z.string(),
  solanaAddress: z.string(),
});

export const WalletAddressesResponseSchema = baseResponse(
  WalletAddressesSchema
);

// Types
export type WalletAddresses = z.infer<typeof WalletAddressesSchema>;
export type WalletAddressesResponse = z.infer<
  typeof WalletAddressesResponseSchema
>;
