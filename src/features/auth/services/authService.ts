import { getEnv } from "@/lib/schema/env";
import {
  NonceRequestSchema,
  NonceDataSchema,
  VerifyRequestSchema,
  VerifyResponseSchema,
  MeResponseSchema,
  GoogleOAuthCallbackRequestSchema,
  GoogleOAuthCallbackResponseSchema,
  RegisterRequestSchema,
  RegisterResponseSchema,
  LoginRequestSchema,
  LoginResponseSchema,
  VerifyOtpRequestSchema,
  VerifyRegisterOtpResponseSchema,
  VerifyLoginOtpResponseSchema,
  RefreshResponseSchema,
  LogoutResponseSchema,
  ForgotPasswordRequestSchema,
  ForgotPasswordResponseSchema,
  VerifyResetTokenRequestSchema,
  VerifyResetTokenResponseSchema,
  ResetPasswordRequestSchema,
  ResetPasswordResponseSchema,
  type NonceRequest,
  type VerifyRequest,
  type GoogleOAuthCallbackRequest,
  type RegisterRequest,
  type LoginRequest,
  type VerifyOtpRequest,
  NonceData,
  NonceResponseSchema,
  VerifyData,
  MeData,
  RegisterData,
  LoginData,
  VerifyRegisterOtpData,
  VerifyLoginOtpData,
  RefreshData,
  LogoutData,
  type ForgotPasswordRequest,
  type ForgotPasswordData,
  type VerifyResetTokenRequest,
  type VerifyResetTokenData,
  type ResetPasswordRequest,
  type ResetPasswordData,
  TokenPairData,
} from "../schema/auth";
import { http } from "@/lib/http/client";
import { SiweMessage } from "siwe";
import { parseAuthError } from "../errors";
import {
  clearAuthTokens,
  getRefreshToken,
  storeAuthTokens,
} from "../utils/tokens";

export const authService = {
  async getNonce(request: NonceRequest): Promise<NonceData> {
    const body = NonceRequestSchema.parse(request);
    const res = await http.post("/api/auth/nonce", body);
    const parsedNonce = NonceResponseSchema.parse(res.data);
    const apiNonce = parsedNonce.data.nonce;
    if (!apiNonce) {
      throw new Error("Nonce not found in response");
    }

    const siwe = new SiweMessage({
      domain: getEnv().NEXT_PUBLIC_DOMAIN,
      address: body.walletAddress,
      statement: "Sign in with Ethereum to the app.",
      uri: getEnv().NEXT_PUBLIC_DOMAIN,
      version: "1",
      chainId: request.chainId,
      nonce: apiNonce,
      issuedAt: new Date().toISOString(),
    });

    const message = siwe.prepareMessage();

    return NonceDataSchema.parse({ nonce: apiNonce, message });
  },

  async verify(request: VerifyRequest): Promise<VerifyData> {
    const body = VerifyRequestSchema.parse(request);
    const res = await http.post("/api/auth/verify", body);
    const parsedVerify = VerifyResponseSchema.parse(res.data);
    storeAuthTokens(parsedVerify.data.token);
    return parsedVerify.data;
  },

  async getMe(): Promise<MeData | null> {
    try {
      const res = await http.get("/api/auth/me");
      const parsedMe = MeResponseSchema.parse(res.data);
      return parsedMe.data;
    } catch (error) {
      return null;
    }
  },

  async googleOAuthCallback(
    request: GoogleOAuthCallbackRequest
  ): Promise<TokenPairData> {
    const body = GoogleOAuthCallbackRequestSchema.parse(request);
    const res = await http.get(
      `/api/auth/oauth/google/callback?code=${body.code}&state=${body.state}`
    );
    console.log({ data: res.data });
    const parsedResponse = GoogleOAuthCallbackResponseSchema.parse(res.data);
    return parsedResponse.data;
  },

  async register(request: RegisterRequest): Promise<RegisterData> {
    try {
      const body = RegisterRequestSchema.parse(request);
      const res = await http.post("/api/auth/register", body);
      const parsedResponse = RegisterResponseSchema.parse(res.data);
      return parsedResponse.data;
    } catch (error) {
      throw parseAuthError(error);
    }
  },

  async login(request: LoginRequest): Promise<LoginData> {
    try {
      const body = LoginRequestSchema.parse(request);
      const res = await http.post("/api/auth/login", body);
      const parsedResponse = LoginResponseSchema.parse(res.data);
      return parsedResponse.data;
    } catch (error) {
      throw parseAuthError(error);
    }
  },

  async verifyRegisterOtp(
    request: VerifyOtpRequest
  ): Promise<VerifyRegisterOtpData> {
    try {
      const body = VerifyOtpRequestSchema.parse(request);
      const res = await http.post("/api/auth/register/verify-otp", body);
      const parsedResponse = VerifyRegisterOtpResponseSchema.parse(res.data);
      storeAuthTokens(
        parsedResponse.data.accessToken,
        parsedResponse.data.refreshToken,
        parsedResponse.data.refreshTokenExpiresAt
      );
      return parsedResponse.data;
    } catch (error) {
      throw parseAuthError(error);
    }
  },

  async verifyLoginOtp(request: VerifyOtpRequest): Promise<VerifyLoginOtpData> {
    try {
      const body = VerifyOtpRequestSchema.parse(request);
      const res = await http.post("/api/auth/login/verify-otp", body);
      const parsedResponse = VerifyLoginOtpResponseSchema.parse(res.data);
      storeAuthTokens(
        parsedResponse.data.accessToken,
        parsedResponse.data.refreshToken,
        parsedResponse.data.refreshTokenExpiresAt
      );
      return parsedResponse.data;
    } catch (error) {
      throw parseAuthError(error);
    }
  },

  async logout(): Promise<LogoutData> {
    try {
      const refreshToken = getRefreshToken();
      const res = await http.post("/api/auth/logout", {
        refreshToken,
      });
      const parsedResponse = LogoutResponseSchema.parse(res.data);
      clearAuthTokens();
      return parsedResponse.data;
    } catch (error) {
      clearAuthTokens();
      throw parseAuthError(error);
    }
  },

  async refreshTokens(token?: string): Promise<RefreshData> {
    const refreshToken = token ?? getRefreshToken();
    if (!refreshToken) {
      throw new Error("Missing refresh token");
    }
    const res = await http.post("/api/auth/refresh", { refreshToken });
    const parsed = RefreshResponseSchema.parse(res.data);
    storeAuthTokens(
      parsed.data.accessToken,
      parsed.data.refreshToken,
      parsed.data.refreshTokenExpiresAt
    );
    return parsed.data;
  },

  async forgotPassword(
    request: ForgotPasswordRequest
  ): Promise<ForgotPasswordData> {
    try {
      const body = ForgotPasswordRequestSchema.parse(request);
      const res = await http.post("/api/auth/forgot-password", body);
      const parsed = ForgotPasswordResponseSchema.parse(res.data);
      return parsed.data;
    } catch (error) {
      throw parseAuthError(error);
    }
  },

  async verifyResetToken(
    request: VerifyResetTokenRequest
  ): Promise<VerifyResetTokenData> {
    try {
      const body = VerifyResetTokenRequestSchema.parse(request);
      const res = await http.post("/api/auth/verify-reset-token", body);
      const parsed = VerifyResetTokenResponseSchema.parse(res.data);
      return parsed.data;
    } catch (error) {
      throw parseAuthError(error);
    }
  },

  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ResetPasswordData> {
    try {
      const body = ResetPasswordRequestSchema.parse(request);
      const res = await http.post("/api/auth/reset-password", body);
      const parsed = ResetPasswordResponseSchema.parse(res.data);
      return parsed.data;
    } catch (error) {
      throw parseAuthError(error);
    }
  },
};
