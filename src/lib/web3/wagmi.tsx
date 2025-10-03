"use client";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { Config, WagmiProvider } from "wagmi";
import PrivyProvider from "./privy";
import { mainnet, sepolia, base, baseSepolia } from "wagmi/chains";
import { ReactNode } from "react";
import { XellarKitProvider, defaultConfig, darkTheme } from "@xellar/kit";

const config = getDefaultConfig({
  appName: "Next Web3 Boilerplate",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo",
  chains: [mainnet, base, sepolia, baseSepolia],
  ssr: true,
});

const xellarKitConfig = defaultConfig({
  appName: "Xellar",
  // Required for WalletConnect
  walletConnectProjectId: "f57c48229f63b096dd4feb3e08810f3b",

  // Required for Xellar Passport
  xellarAppId: "9a2fb802-a0cd-43dd-be96-eb1f5e8e3fb2",
  xellarEnv: "sandbox",
  ssr: true, // Use this if you're using Next.js App Router
}) as Config;

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      {/* <RainbowKitProvider>
        <PrivyProvider>{children}</PrivyProvider>
      </RainbowKitProvider> */}
      <XellarKitProvider theme={darkTheme}>{children}</XellarKitProvider>
    </WagmiProvider>
  );
}
