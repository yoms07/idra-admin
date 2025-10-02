"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { getEnv } from "../schema/env";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={getEnv().NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
