import { z } from "zod";

// Base API response wrapper
export const baseResponse = <T extends z.ZodTypeAny>(data: T) =>
  z.object({ data });

export type BaseResponse<T> = { data: T };

export const NonceRequestSchema = z.object({
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
});

// Nonce response schema
export const NonceDataSchema = z.object({
  nonce: z.string(),
  message: z.string().optional(),
});
export const NonceResponseSchema = baseResponse(NonceDataSchema);

// Verify request schema
export const VerifyRequestSchema = z.object({
  message: z.string(),
  signature: z
    .string()
    .regex(/^0x[a-fA-F0-9]{130}$/, "Invalid signature format"),
});

// Verify response schema
export const VerifyDataSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    walletAddress: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
  }),
});
export const VerifyResponseSchema = baseResponse(VerifyDataSchema);

// Me response schema (user profile)
export const MeDataSchema = z.object({
  id: z.string(),
  walletAddress: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const MeResponseSchema = baseResponse(MeDataSchema);

// Type exports
export type NonceRequest = z.infer<typeof NonceRequestSchema>;
export type NonceResponse = z.infer<typeof NonceResponseSchema>;
export type NonceData = z.infer<typeof NonceDataSchema>;
export type VerifyRequest = z.infer<typeof VerifyRequestSchema>;
export type VerifyData = z.infer<typeof VerifyDataSchema>;
export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
export type MeData = z.infer<typeof MeDataSchema>;
export type AuthUser = z.infer<typeof MeDataSchema>;
