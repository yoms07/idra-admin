import { z } from "zod";
import { baseResponse } from "@/lib/response";
import { RoleEnum, type Role } from "./user";

// Admin User schema
export const AdminUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: RoleEnum,
  isVerified: z.boolean(),
  emailVerifiedAt: z.string().nullable(),
  offchainBalance: z.string(),
  onchainBalance: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

// Admin User List Response
export const AdminUserListResponseSchema = z.object({
  data: z.array(AdminUserSchema),
  pagination: PaginationSchema,
});

// Verify/Unverify Response
export const VerifyUserResponseSchema = baseResponse(
  z.object({
    id: z.string(),
    email: z.string(),
    isVerified: z.boolean(),
    message: z.string(),
  })
);

// Sync Onchain Balance Response
export const SyncOnchainBalanceResponseSchema = baseResponse(
  z.object({
    userId: z.string(),
    walletAddress: z.string(),
    onchainBalance: z.string(),
    offchainBalance: z.string(),
    chainId: z.number(),
    message: z.string(),
  })
);

// Pull IDRA Response
export const PullIdraResponseSchema = baseResponse(
  z.object({
    txHash: z.string(),
    recipientAddress: z.string(),
    message: z.string(),
  })
);

// Chain Balance schema
export const ChainBalanceSchema = z.object({
  id: z.string().nullable(),
  chainId: z.number(),
  chainName: z.string(),
  chainSlug: z.string(),
  onchainBalance: z.string(),
  lastSyncedAt: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

// User Chain Balances Response
export const UserChainBalancesResponseSchema = baseResponse(
  z.object({
    userId: z.string(),
    chainBalances: z.array(ChainBalanceSchema),
    totalChains: z.number(),
  })
);

// Admin User List Params
export interface AdminUserListParams {
  page?: number;
  limit?: number;
  role?: Role;
  isVerified?: boolean;
  email?: string;
  search?: string;
}

// Sync Onchain Balance Params
export interface SyncOnchainBalanceParams {
  userId: string;
  chainId: number;
}

// Pull IDRA Params
export interface PullIdraParams {
  userId: string;
  chainId: number;
  amount: string;
  recipientAddress: string;
}

// Types
export type AdminUser = z.infer<typeof AdminUserSchema>;
export type AdminUserListResponse = z.infer<typeof AdminUserListResponseSchema>;
export type VerifyUserResponse = z.infer<typeof VerifyUserResponseSchema>;
export type SyncOnchainBalanceResponse = z.infer<
  typeof SyncOnchainBalanceResponseSchema
>;
export type PullIdraResponse = z.infer<typeof PullIdraResponseSchema>;
export type ChainBalance = z.infer<typeof ChainBalanceSchema>;
export type UserChainBalancesResponse = z.infer<
  typeof UserChainBalancesResponseSchema
>;
