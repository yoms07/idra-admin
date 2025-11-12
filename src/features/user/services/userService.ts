import { http } from "@/lib/http/client";
import {
  WalletAddressesResponseSchema,
  type WalletAddresses,
} from "../schema/user";

export const userService = {
  async getWalletAddresses(): Promise<WalletAddresses> {
    const res = await http.get("/api/user/wallet/addresses");
    const parsed = WalletAddressesResponseSchema.parse(res.data);
    return parsed.data;
  },
};
