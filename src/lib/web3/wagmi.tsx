"use client";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import PrivyProvider from "./privy";
import { mainnet, sepolia, base, baseSepolia } from "wagmi/chains";
import { ReactNode } from "react";

const config = getDefaultConfig({
  appName: "Next Web3 Boilerplate",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo",
  chains: [mainnet, base, sepolia, baseSepolia],
  ssr: true,
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        <PrivyProvider>{children}</PrivyProvider>
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
