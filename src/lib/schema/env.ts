import { z } from "zod";

export const EnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_SUBGRAPH_URL: z.string().url().optional(),
  NEXT_PUBLIC_PRIVY_APP_ID: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;
let initialized = false;

export function getEnv(): Env {
  if (initialized) {
    return env;
  }
  const parseAttempt = EnvSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SUBGRAPH_URL: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  });
  if (!parseAttempt.success) {
    console.error(
      "Invalid environment variables",
      parseAttempt.error.flatten()
    );
    throw new Error("Invalid environment variables");
  }
  env = parseAttempt.data;
  initialized = true;
  return env;
}
