import { http } from "@/lib/http/client";
import {
  AdminUserListResponseSchema,
  VerifyUserResponseSchema,
  SyncOnchainBalanceResponseSchema,
  PullIdraResponseSchema,
  type AdminUserListParams,
  type AdminUserListResponse,
  type VerifyUserResponse,
  type SyncOnchainBalanceParams,
  type SyncOnchainBalanceResponse,
  type PullIdraParams,
  type PullIdraResponse,
} from "../schema/adminUser";

export const adminUserService = {
  async listUsers(
    params?: AdminUserListParams
  ): Promise<AdminUserListResponse> {
    const res = await http.get("/api/admin/users", { params });
    const parsed = AdminUserListResponseSchema.parse(res.data);
    return parsed;
  },

  async verifyUser(userId: string): Promise<VerifyUserResponse> {
    const res = await http.post(`/api/admin/users/${userId}/verify`);
    const parsed = VerifyUserResponseSchema.parse(res.data);
    return parsed;
  },

  async unverifyUser(userId: string): Promise<VerifyUserResponse> {
    const res = await http.post(`/api/admin/users/${userId}/unverify`);
    const parsed = VerifyUserResponseSchema.parse(res.data);
    return parsed;
  },

  async syncOnchainBalance(
    params: SyncOnchainBalanceParams
  ): Promise<SyncOnchainBalanceResponse> {
    const res = await http.post("/api/admin/wallet/sync-balance", params);
    const parsed = SyncOnchainBalanceResponseSchema.parse(res.data);
    return parsed;
  },

  async pullIdra(params: PullIdraParams): Promise<PullIdraResponse> {
    const res = await http.post("/api/admin/wallet/pull-idra", params);
    const parsed = PullIdraResponseSchema.parse(res.data);
    return parsed;
  },
};
