import { z } from "zod";
import { baseResponse } from "@/lib/response";

// Role enum
export const RoleEnum = z.enum(["USER", "ADMIN"]);
export type Role = z.infer<typeof RoleEnum>;

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
