"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { Config, WagmiProvider } from "wagmi";
import { baseSepolia, polygon } from "wagmi/chains";
import { ReactNode } from "react";
import { XellarKitProvider, defaultConfig, darkTheme } from "@xellar/kit";
import { getEnv } from "../schema/env";
const getChains = () => {
  if (process.env.NEXT_PUBLIC_ENV === "production") {
    return polygon;
  }
  return baseSepolia;
};

const xellarKitConfig = defaultConfig({
  appName: "IDRA",
  walletConnectProjectId: getEnv().NEXT_PUBLIC_WALLET_CONNECT_APP_ID,
  xellarAppId: getEnv().NEXT_PUBLIC_XELLAR_APP_ID,
  xellarEnv: "production",
  chains: [getChains()],
}) as Config;

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={xellarKitConfig}>
      <XellarKitProvider theme={darkTheme}>{children}</XellarKitProvider>
    </WagmiProvider>
  );
}
