import { http } from "@/lib/http/client";
import {
  CreateTransferRequestSchema,
  CreateTransferResponseSchema,
  TransferListResponseSchema,
  TransferResponseSchema,
  SupportedChainsResponseSchema,
  CheckFirstTimeAddressRequestSchema,
  CheckFirstTimeAddressResponseSchema,
  ConfirmTransferRequestSchema,
  ConfirmTransferResponseSchema,
  type CreateTransferRequest,
  type CreateTransferResponse,
  type ConfirmTransferRequest,
  type ConfirmTransferResponse,
  type Transfer,
  type SupportedChain,
  type CheckFirstTimeAddressRequest,
  type CheckFirstTimeAddressResponse,
} from "../schema/transfer";

export const transferService = {
  async create(input: CreateTransferRequest): Promise<CreateTransferResponse> {
    const body = CreateTransferRequestSchema.parse(input);
    const res = await http.post("/api/wallet/transfers", body);
    const parsed = CreateTransferResponseSchema.parse(res.data);
    return parsed.data;
  },

  async confirm(
    input: ConfirmTransferRequest
  ): Promise<ConfirmTransferResponse> {
    const body = ConfirmTransferRequestSchema.parse(input);
    const res = await http.post("/api/wallet/transfers/confirm", body);
    const parsed = ConfirmTransferResponseSchema.parse(res.data);
    return parsed.data;
  },

  async getById(id: string): Promise<Transfer> {
    const res = await http.get(`/api/wallet/transfers/${id}`);
    const parsed = TransferResponseSchema.parse(res.data);
    return parsed.data;
  },

  async list(params?: {
    limit?: number;
    offset?: number;
  }): Promise<Transfer[]> {
    const res = await http.get("/api/wallet/transfers", { params });
    const parsed = TransferListResponseSchema.parse(res.data);
    return parsed.data;
  },

  async getChains(): Promise<SupportedChain[]> {
    const res = await http.get("/api/wallet/transfer/chains");
    const parsed = SupportedChainsResponseSchema.parse(res.data);
    return parsed.data;
  },

  async checkFirstTimeAddress(
    input: CheckFirstTimeAddressRequest
  ): Promise<CheckFirstTimeAddressResponse> {
    const body = CheckFirstTimeAddressRequestSchema.parse(input);
    const res = await http.post("/api/wallet/check-first-time-address", body);
    const parsed = CheckFirstTimeAddressResponseSchema.parse(res.data);
    return parsed.data;
  },
};
