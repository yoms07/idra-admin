"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { Button } from "@/components/ui/button";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import {
  useCreateTransfer,
  useSupportedChains,
} from "@/features/transfer/hooks/useTransfer";
import { Copy, CheckCircle } from "lucide-react";
import { formatIDR, formatIDRA } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useCurrentNetwork } from "../../hooks/useCurrentNetwork";

// Truncate address for display
function truncateAddress(address: string | null): string {
  if (!address) return "-";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function OnchainConfirmStep() {
  const form = useFormContext<TransferFormValues>();
  const { goNext, goPrevious } = useMultiStepModal();
  const { address, chainId, amount } = form.getValues();
  const network = useCurrentNetwork();
  const createTransfer = useCreateTransfer();

  const [copied, setCopied] = React.useState(false);

  const amountNum = Number(amount ?? 0);
  const totalValue = amountNum;
  const idraAmount = amountNum;

  const handleCopyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onConfirm = async () => {
    if (!address || !chainId || amountNum <= 0) {
      return;
    }
    try {
      const result = await createTransfer.mutateAsync({
        amount: String(amountNum),
        toAddress: address.trim(),
        chainId,
      });
      form.setValue("transferId", result.transferId);
      goNext();
    } catch (error) {
      console.error("Failed to create transfer:", error);
    }
  };

  return (
    <div className="space-y-6 font-manrope text-base">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Send Assets</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatIDRA(idraAmount)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Total Value</span>
          <span className="font-semibold">{formatIDR(totalValue)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Address</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold font-mono text-sm">
              {truncateAddress(address ?? null)}
            </span>
            {address && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCopyAddress}
                title="Copy address"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Chain</span>
          <span className="font-semibold">{network?.name}</span>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Fee Estimate</span>
          <span className="font-semibold">$0</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563] text-base">Estimated Time</span>
          <span className="font-semibold">~30s</span>
        </div>
      </div>

      {/* Warning box for first-time address interaction */}
      {/* <div className="bg-[#F3F4F6] rounded-lg p-4 flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
        </div>
        <p className="text-sm text-[#111827]">
          This is the first time you've interacted with this address. Please
          check the details carefully before interacting.
        </p>
      </div> */}

      <div className="flex justify-between">
        <Button variant="outline" onClick={goPrevious}>
          Back
        </Button>
        <Button
          onClick={onConfirm}
          disabled={
            createTransfer.isPending || !address || !chainId || amountNum <= 0
          }
        >
          {createTransfer.isPending ? "Loading..." : "Confirm"}
        </Button>
      </div>
    </div>
  );
}
