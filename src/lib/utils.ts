import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
