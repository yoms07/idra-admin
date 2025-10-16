import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { polygon, baseSepolia } from "viem/chains";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIDR(amount: number | string) {
  const amountNumber = typeof amount === "string" ? parseFloat(amount) : amount;
  return amountNumber.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
}

export function formatIDRA(amount: number | string) {
  const amountNumber = typeof amount === "string" ? parseFloat(amount) : amount;
  const formattedAmount = amountNumber.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${formattedAmount} IDRA`;
}

export function isTheSameAddress(address1: string, address2: string) {
  return address1.toLowerCase() === address2.toLowerCase();
}

const chains = [polygon, baseSepolia];

export function getExplorerTxUrl(chainId: number, txHash: string) {
  const chain = chains.find((c) => c.id === chainId);
  const baseUrl = chain?.blockExplorers?.default?.url;
  return baseUrl ? `${baseUrl.replace(/\/?$/, "")}/tx/${txHash}` : null;
}
