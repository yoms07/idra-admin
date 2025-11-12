"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { Button } from "@/components/ui/button";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import {
  useTransferById,
  useSupportedChains,
} from "@/features/transfer/hooks/useTransfer";

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

  const statusMessage = getStatusMessage(transfer?.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-semibold">Transfer Processing</h3>
        <div className="text-3xl font-extrabold mt-4">
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
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">{statusMessage}</p>
        <p className="text-sm text-muted-foreground">
          We're processing your on-chain transfer... (Est. 30 seconds).
        </p>
        <p className="text-sm text-muted-foreground">
          You can safely close this window. We will send a confirmation to your
          email as soon as the transfer is complete.
        </p>
      </div>

      {/* Hourglass Icon */}
      <div className="flex items-center justify-center py-8">
        <div className="relative w-32 h-32">
          <svg
            viewBox="0 0 100 120"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top chamber frame */}
            <path
              d="M 30 10 L 70 10 L 70 45 L 50 55 L 30 45 Z"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Middle narrow part */}
            <path
              d="M 50 55 L 50 65"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Bottom chamber frame */}
            <path
              d="M 30 65 L 50 75 L 70 65 L 70 100 L 30 100 Z"
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Top sand (red) - remaining */}
            <path
              d="M 32 12 L 68 12 L 68 43 L 50 53 L 32 43 Z"
              fill="#ef4444"
              opacity="0.9"
            />
            {/* Falling sand stream (red) */}
            <ellipse cx="50" cy="60" rx="6" ry="2" fill="#ef4444" opacity="0.7">
              <animate
                attributeName="cy"
                values="60;70;70"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.7;0.3;0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </ellipse>
            {/* Bottom sand (red) - accumulating */}
            <path
              d="M 32 67 L 50 73 L 68 67 L 68 85 L 32 85 Z"
              fill="#ef4444"
              opacity="0.8"
            >
              <animate
                attributeName="d"
                values="M 32 67 L 50 73 L 68 67 L 68 85 L 32 85 Z;M 32 67 L 50 73 L 68 67 L 68 90 L 32 90 Z;M 32 67 L 50 73 L 68 67 L 68 95 L 32 95 Z"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      </div>

      {/* Show error message if failed */}
      {transfer?.status === "failed" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-sm text-red-800">
            The transfer failed. Please try again or contact support if the
            problem persists.
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="pt-2">
        <Button className="w-full" onClick={goNext}>
          View Transaction
        </Button>
      </div>
    </div>
  );
}
