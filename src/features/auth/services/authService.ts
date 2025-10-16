import { getEnv } from "@/lib/schema/env";
import {
  NonceRequestSchema,
  NonceDataSchema,
  VerifyRequestSchema,
  VerifyResponseSchema,
  MeResponseSchema,
  type NonceRequest,
  type VerifyRequest,
  NonceData,
  NonceResponseSchema,
  VerifyData,
  MeData,
} from "../schema/auth";
import { http } from "@/lib/http/client";
import { SiweMessage } from "siwe";

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
        localStorage.setItem("auth_token", parsedVerify.data.token);
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
};
