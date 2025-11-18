import { z } from "zod";

// Base API response wrapper
export const baseResponse = <T extends z.ZodTypeAny>(data: T) =>
  z.object({ data });

export type BaseResponse<T> = { data: T };
