"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { Config, WagmiProvider } from "wagmi";
import { mainnet, sepolia, base, baseSepolia } from "wagmi/chains";
import { ReactNode } from "react";
import { XellarKitProvider, defaultConfig, darkTheme } from "@xellar/kit";

const xellarKitConfig = defaultConfig({
  appName: "IDRA",
  // Required for WalletConnect
  walletConnectProjectId: "1739bc49ead3bffa513fd00d8adb54e2",

  // Required for Xellar Passport
  xellarAppId: "9a2fb802-a0cd-43dd-be96-eb1f5e8e3fb2",
  xellarEnv: "sandbox",
  ssr: true, // Use this if you're using Next.js App Router
  chains: [baseSepolia],
}) as Config;

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={xellarKitConfig}>
      <XellarKitProvider theme={darkTheme}>{children}</XellarKitProvider>
    </WagmiProvider>
  );
}
