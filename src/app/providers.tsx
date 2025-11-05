"use client";
import { QueryProvider } from "@/state/query/queryClient";
import { Web3Provider } from "@/lib/web3/wagmi";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <Web3Provider>{children}</Web3Provider>
    </QueryProvider>
  );
}
