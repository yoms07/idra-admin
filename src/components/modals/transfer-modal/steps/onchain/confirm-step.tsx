"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { Button } from "@/components/ui/button";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import {
  useCreateTransfer,
  useSupportedChains,
  useCheckFirstTimeAddress,
} from "@/features/transfer/hooks/useTransfer";
import { Copy } from "lucide-react";
import { formatIDR, formatIDRA } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCurrentNetwork } from "../../hooks/useCurrentNetwork";
import Image from "next/image";

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

  const { data: firstTimeData, isLoading: isCheckingFirstTime } =
    useCheckFirstTimeAddress(address?.trim());

  const isFirstTime = firstTimeData?.isFirstTime ?? false;
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  // Reset confirmation when address changes
  React.useEffect(() => {
    setIsConfirmed(false);
  }, [address]);

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
    // Require checkbox confirmation if it's first time
    if (isFirstTime && !isConfirmed) {
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

  const canConfirm =
    address &&
    chainId &&
    amountNum > 0 &&
    (!isFirstTime || isConfirmed) &&
    !isCheckingFirstTime;

  return (
    <div className="space-y-6 font-manrope text-base">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Send Assets</span>
          <div className="flex items-center gap-1 font-semibold">
            <Image
              src="/images/logo-mobile.png"
              width={16}
              height={16}
              alt="idra-coin-logo"
            />
            {amount?.toLocaleString?.("id-ID") ?? amount}
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

      {/* First time warning */}
      {isFirstTime && (
        <Alert className="bg-[#F5F5F5] border-none">
          <AlertDescription className="text-[#111827]">
            <div className="space-y-2 flex items-center gap-4">
              <div className="flex items-center gap-2 mt-3">
                <Checkbox
                  id="confirm-first-time"
                  className="size-5"
                  checked={isConfirmed}
                  onCheckedChange={(checked) =>
                    setIsConfirmed(checked === true)
                  }
                />
              </div>
              <p
                className="font-medium text-[#4B5563] text-xs"
                style={{
                  lineHeight: "16px",
                }}
              >
                This is the first time you've interacted with this address.{" "}
                <br />
                Please check the details carefully before interacting.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline-secondary" onClick={goPrevious}>
          Back
        </Button>
        <Button
          onClick={onConfirm}
          disabled={createTransfer.isPending || !canConfirm}
        >
          {createTransfer.isPending
            ? "Processing..."
            : isCheckingFirstTime
              ? "Checking..."
              : "Confirm"}
        </Button>
      </div>
    </div>
  );
}
