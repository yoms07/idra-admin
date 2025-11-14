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
  LogoutResponseSchema,
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
  GoogleOAuthCallbackData,
  RegisterData,
  LoginData,
  VerifyRegisterOtpData,
  VerifyLoginOtpData,
  LogoutData,
} from "../schema/auth";
import { http } from "@/lib/http/client";
import { SiweMessage } from "siwe";
import Cookies from "js-cookie";
import { parseAuthError } from "../errors";

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
    if (typeof window !== "undefined") {
      try {
        Cookies.set("at", parsedVerify.data.token);
      } catch (_) {}
    }
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
  ): Promise<GoogleOAuthCallbackData> {
    const body = GoogleOAuthCallbackRequestSchema.parse(request);
    const res = await http.get(
      `/api/auth/oauth/google/callback?code=${body.code}&state=${body.state}`
    );
    const parsedResponse = GoogleOAuthCallbackResponseSchema.parse(res.data);
    if (typeof window !== "undefined") {
      try {
        Cookies.set("at", parsedResponse.data.token);
      } catch (_) {}
    }
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
      if (typeof window !== "undefined") {
        try {
          Cookies.set("at", parsedResponse.data.token);
        } catch (_) {}
      }
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
      if (typeof window !== "undefined") {
        try {
          Cookies.set("at", parsedResponse.data.token);
        } catch (_) {}
      }
      return parsedResponse.data;
    } catch (error) {
      throw parseAuthError(error);
    }
  },

  async logout(): Promise<LogoutData> {
    try {
      const res = await http.post("/api/auth/logout");
      const parsedResponse = LogoutResponseSchema.parse(res.data);
      if (typeof window !== "undefined") {
        try {
          Cookies.remove("at");
        } catch (_) {}
      }
      return parsedResponse.data;
    } catch (error) {
      throw parseAuthError(error);
    }
  },
};
