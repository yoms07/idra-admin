"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import type { DepositFormValues } from "../../deposit-modal";

export function SuccessStep() {
  const { reset, watch } = useFormContext<DepositFormValues>();
  const amount = watch("amount") ?? 0;
  const method = watch("paymentMethod");
  const bankName = method === "va" ? "Bank Central Asia (BCA)" : "-";
  const accountName = "-"; // replace when available
  const txid = "-"; // replace when available
  const feeEstimate = "Rp 0"; // replace when available
  const totalValue = `Rp ${amount?.toLocaleString?.("id-ID") ?? amount}`;
  const date = new Date().toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-semibold">Transfered Details</h3>
        <div className="h-px bg-border" />
        <div className="text-3xl font-extrabold mt-4">
          +{amount?.toLocaleString?.("id-ID") ?? amount} IDRA
        </div>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Crypto transferred out of platform. Please contact the recipient
          platform for your transaction receipt.
        </p>
        <div className="h-px bg-border mt-2" />
      </div>

      {/* Lottie placeholder (replace with provided lottie) */}
      <div className="flex items-center justify-center py-8">
        <div className="w-32 h-32 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          ✓
        </div>
      </div>

      {/* Details rows */}
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Bank Name</div>
          <div className="font-semibold text-right">{bankName}</div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Account Name</div>
          <div className="font-semibold text-right">{accountName}</div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Txid</div>
          <div className="font-semibold text-right">{txid}</div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Send Assets</div>
          <div className="font-semibold text-right">
            {amount?.toLocaleString?.("id-ID") ?? amount} IDRA
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Fee Estimate</div>
          <div className="font-semibold text-right">{feeEstimate}</div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Total Value</div>
          <div className="font-semibold text-right">{totalValue}</div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Date</div>
          <div className="font-semibold text-right">{date}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2">
        <Button className="w-full">Download Transaction</Button>
      </div>
    </div>
  );
}
