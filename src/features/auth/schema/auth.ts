import { z } from "zod";

// Base API response wrapper
export const baseResponse = <T extends z.ZodTypeAny>(data: T) =>
  z.object({ data });

export type BaseResponse<T> = { data: T };

export const NonceRequestSchema = z.object({
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  chainId: z.number(),
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
  name: z.string(),
  email: z.string(),
  offchainBalance: z.string(),
});
export const MeResponseSchema = baseResponse(MeDataSchema);

// Google OAuth callback request schema
export const GoogleOAuthCallbackRequestSchema = z.object({
  code: z.string(),
  state: z.string().optional(),
});

// Google OAuth user schema
export const GoogleOAuthUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  emailVerifiedAt: z.coerce.date().nullable(),
  offchainBalance: z.string(),
});

// Google OAuth callback response schema
export const GoogleOAuthCallbackDataSchema = z.object({
  token: z.string(),
  user: GoogleOAuthUserSchema,
});
export const GoogleOAuthCallbackResponseSchema = baseResponse(
  GoogleOAuthCallbackDataSchema
);

// Register request schema
export const RegisterRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

// Register response schema
export const RegisterDataSchema = z.object({
  sent: z.boolean(),
  otpId: z.string(),
});
export const RegisterResponseSchema = baseResponse(RegisterDataSchema);

// Login request schema
export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Login response schema
export const LoginDataSchema = z.object({
  sent: z.boolean(),
  otpId: z.string(),
});
export const LoginResponseSchema = baseResponse(LoginDataSchema);

// Verify OTP request schema (for both register and login)
export const VerifyOtpRequestSchema = z.object({
  otpId: z.string().min(1, "OTP ID is required"),
  email: z.string().email("Invalid email address"),
  code: z.string().regex(/^\d{6}$/, "OTP code must be 6 digits"),
});

// User schema for OTP verification response
export const OtpVerifyUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  offchainBalance: z.string(),
  createdAt: z.string(),
});

// Verify OTP response schema (for register)
export const VerifyRegisterOtpDataSchema = z.object({
  token: z.string(),
  user: OtpVerifyUserSchema,
  valid: z.boolean(),
});
export const VerifyRegisterOtpResponseSchema = baseResponse(
  VerifyRegisterOtpDataSchema
);

// Verify OTP response schema (for login)
export const VerifyLoginOtpDataSchema = z.object({
  token: z.string(),
  user: OtpVerifyUserSchema,
});
export const VerifyLoginOtpResponseSchema = baseResponse(
  VerifyLoginOtpDataSchema
);

// Logout response schema
export const LogoutDataSchema = z.object({
  message: z.string(),
});
export const LogoutResponseSchema = baseResponse(LogoutDataSchema);

// Forgot Password Request
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ForgotPasswordDataSchema = z.object({
  sent: z.boolean(),
});
export const ForgotPasswordResponseSchema = baseResponse(
  ForgotPasswordDataSchema
);

// Verify Reset Token Request
export const VerifyResetTokenRequestSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const VerifyResetTokenDataSchema = z.object({
  valid: z.boolean(),
  email: z.string().email(),
});
export const VerifyResetTokenResponseSchema = baseResponse(
  VerifyResetTokenDataSchema
);

// Reset Password Request
export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const ResetPasswordDataSchema = z.object({
  success: z.boolean(),
});
export const ResetPasswordResponseSchema = baseResponse(
  ResetPasswordDataSchema
);

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
export type GoogleOAuthCallbackRequest = z.infer<
  typeof GoogleOAuthCallbackRequestSchema
>;
export type GoogleOAuthCallbackData = z.infer<
  typeof GoogleOAuthCallbackDataSchema
>;
export type GoogleOAuthCallbackResponse = z.infer<
  typeof GoogleOAuthCallbackResponseSchema
>;
export type GoogleOAuthUser = z.infer<typeof GoogleOAuthUserSchema>;

// Email/Password/OTP flow types
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterData = z.infer<typeof RegisterDataSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginData = z.infer<typeof LoginDataSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type VerifyOtpRequest = z.infer<typeof VerifyOtpRequestSchema>;
export type OtpVerifyUser = z.infer<typeof OtpVerifyUserSchema>;
export type VerifyRegisterOtpData = z.infer<typeof VerifyRegisterOtpDataSchema>;
export type VerifyRegisterOtpResponse = z.infer<
  typeof VerifyRegisterOtpResponseSchema
>;
export type VerifyLoginOtpData = z.infer<typeof VerifyLoginOtpDataSchema>;
export type VerifyLoginOtpResponse = z.infer<
  typeof VerifyLoginOtpResponseSchema
>;
export type LogoutData = z.infer<typeof LogoutDataSchema>;
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ForgotPasswordData = z.infer<typeof ForgotPasswordDataSchema>;
export type ForgotPasswordResponse = z.infer<
  typeof ForgotPasswordResponseSchema
>;
export type VerifyResetTokenRequest = z.infer<
  typeof VerifyResetTokenRequestSchema
>;
export type VerifyResetTokenData = z.infer<typeof VerifyResetTokenDataSchema>;
export type VerifyResetTokenResponse = z.infer<
  typeof VerifyResetTokenResponseSchema
>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type ResetPasswordData = z.infer<typeof ResetPasswordDataSchema>;
export type ResetPasswordResponse = z.infer<typeof ResetPasswordResponseSchema>;
