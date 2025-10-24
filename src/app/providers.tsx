"use client";
import { QueryProvider } from "@/state/query/queryClient";
import { Web3Provider } from "@/lib/web3/wagmi";
import { ReactNode } from "react";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <Web3Provider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </Web3Provider>
    </QueryProvider>
  );
}
