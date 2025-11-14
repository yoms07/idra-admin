"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import {
  useTransferById,
  useSupportedChains,
} from "@/features/transfer/hooks/useTransfer";
import Image from "next/image";

// Get status message based on transfer status
function getStatusMessage(status: string | undefined): string {
  switch (status) {
    case "pending":
      return "Transfer is being prepared...";
    case "queued":
      return "Transfer is queued and waiting to be processed...";
    case "minting":
      return "Minting tokens on-chain...";
    case "completed":
      return "Transfer completed successfully!";
    case "failed":
      return "Transfer failed. Please try again.";
    default:
      return "Processing your transfer...";
  }
}

export function OnchainProcessingStep() {
  const form = useFormContext<TransferFormValues>();
  const { goNext } = useMultiStepModal();
  const transferId = form.watch("transferId");
  const amount = form.watch("amount");
  const amountNum = Number(amount ?? 0);

  // Get supported chains first (as requested)
  const { data: supportedChains, isLoading: isLoadingChains } =
    useSupportedChains();

  // Poll transfer status
  const {
    data: transfer,
    refetch,
    isFetching,
  } = useTransferById(transferId || undefined);

  // Auto-advance to success when completed
  React.useEffect(() => {
    if (!transfer) return;

    if (transfer.status === "completed") {
      goNext();
    }
  }, [transfer?.status, goNext]);

  // Poll for status updates every 2 seconds
  React.useEffect(() => {
    if (!transferId) return;
    if (transfer?.status === "completed" || transfer?.status === "failed") {
      return;
    }

    const intervalId = setInterval(() => {
      if (!isFetching) {
        refetch();
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [transferId, transfer?.status, isFetching, refetch]);

  // Show loading state while fetching chains
  if (isLoadingChains) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="text-3xl font-extrabold">
          -
          {amountNum > 0
            ? amountNum.toLocaleString("id-ID", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : "0"}{" "}
          IDRA
        </div>
      </div>

      {/* Processing Messages */}
      <div className="space-y-0 text-center">
        <p className="text-sm text-[#404040]">
          We're validating and sending your assets... (Est. 30 seconds).
        </p>
        <p className="text-sm text-[#404040]">
          You can safely close this window. We will send a confirmation to your
          email as soon as the transfer is complete.
        </p>
      </div>

      <Image
        src="/images/hour-glass.png"
        width={150}
        height={150}
        className="mx-auto"
        alt="hour-glass"
      />
    </div>
  );
}
