"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { useWithdrawalById } from "@/features/withdrawal";
import { useBankAccounts } from "@/features/bank-accounts/hooks/useBankAccounts";
import { usePaymentMethods } from "@/features/withdrawal";
import {
  useTransferById,
  useSupportedChains,
} from "@/features/transfer/hooks/useTransfer";
import { formatIDR, formatIDRA } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import { useCurrentNetwork } from "../../hooks/useCurrentNetwork";
import Image from "next/image";

// Truncate address for display
function truncateAddress(address: string | null): string {
  if (!address) return "-";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format transaction hash for display (can be long, split across lines)
function formatTxHash(txHash: string | null | undefined): string {
  if (!txHash) return "-";
  if (txHash.length <= 20) return txHash;
  // Split into chunks for better display
  const chunk1 = txHash.slice(0, 28);
  const chunk2 = txHash.slice(28);
  return `${chunk1}\n${chunk2}`;
}

export function SuccessStep() {
  const form = useFormContext<TransferFormValues>();
  const { close } = useMultiStepModal();
  const destination = form.watch("destination");
  const withdrawalId = form.watch("withdrawalId");
  const transferId = form.watch("transferId");
  const amount = form.watch("amount");
  const address = form.watch("address");
  const network = useCurrentNetwork();

  // Fetch data based on destination
  const { data: withdrawal, isLoading: isLoadingWithdrawal } =
    useWithdrawalById(
      destination === "bank" ? withdrawalId || undefined : undefined
    );
  const { data: transfer, isLoading: isLoadingTransfer } = useTransferById(
    destination === "onchain" ? transferId || undefined : undefined
  );
  const { data: supportedChains } = useSupportedChains();
  const { data: accounts } = useBankAccounts();
  const { data: paymentMethods } = usePaymentMethods();

  const isLoading = isLoadingWithdrawal || isLoadingTransfer;

  const bankAccountId = form.watch("bankAccountId");
  const selectedAccount = accounts?.find((a) => a.id === bankAccountId);

  const selectedPaymentMethod = React.useMemo(() => {
    if (!selectedAccount || !paymentMethods) return null;
    return paymentMethods.find(
      (pm) =>
        pm.bankCode.toLowerCase() === selectedAccount.bankCode?.toLowerCase() ||
        pm.bankCode.toLowerCase() === selectedAccount.bankName?.toLowerCase() ||
        pm.bankName.toLowerCase() === selectedAccount.bankName?.toLowerCase()
    );
  }, [selectedAccount, paymentMethods]);

  const amountNum = Number(amount ?? 0);

  // Get chain info for transfers
  const chainInfo = React.useMemo(() => {
    if (!transfer?.chainId || !supportedChains) return null;
    return supportedChains.find((c) => c.id === transfer.chainId);
  }, [transfer, supportedChains]);

  // Calculate fees
  const feeEstimate = React.useMemo(() => {
    if (destination === "onchain" && transfer?.transferFees) {
      // Sum all fees paid by user
      const userFees = transfer.transferFees
        .filter((f) => f.paidBy === "user")
        .reduce((sum, f) => sum + parseFloat(f.amount || "0"), 0);
      return userFees;
    }
    if (destination === "bank" && selectedPaymentMethod && amountNum) {
      const flatFee = selectedPaymentMethod.feeFlat || 0;
      const percentageFee =
        (amountNum * (selectedPaymentMethod.feePercentage || 0)) / 100;
      return flatFee + percentageFee;
    }
    return 0;
  }, [destination, transfer, selectedPaymentMethod, amountNum]);

  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  // Get transaction date
  const date = React.useMemo(() => {
    const dateStr =
      destination === "onchain" ? transfer?.createdAt : withdrawal?.createdAt;
    if (dateStr) {
      return new Date(dateStr).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [destination, transfer, withdrawal]);

  // Get transaction ID
  const txid =
    destination === "onchain"
      ? transfer?.transactionHash || transfer?.id || "-"
      : withdrawal?.id || "-";

  // Get address for onchain transfers
  const transferAddress =
    destination === "onchain" ? transfer?.toAddress || address : null;

  const totalValue = amountNum;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">
          Loading transaction details...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="text-3xl font-extrabold mt-2">
          -
          {amountNum > 0
            ? amountNum.toLocaleString("id-ID", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : "0"}{" "}
          IDRA
        </div>
        <p className="text-[#404040] text-sm max-w-md mx-auto">
          Crypto transferred out of platform. Please contact the recipient
          platform for your transaction receipt.
        </p>
        <div className="h-px bg-border mt-2" />
      </div>

      {/* Checkmark icon */}
      <Image
        className="mx-auto"
        src="/images/success-check.png"
        width={240}
        height={240}
        alt="success-check"
      />

      {/* Details rows */}
      <div className="grid grid-cols-1 gap-4">
        {/* Bank-specific fields */}
        {destination === "bank" && (
          <>
            <div className="grid grid-cols-2 items-center">
              <div className="text-[#4B5563] text-base">Bank Name</div>
              <div className="font-semibold text-right">
                {selectedAccount?.bankName || "-"}
              </div>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-[#4B5563] text-base">Account Name</div>
              <div className="font-semibold text-right">
                {selectedAccount?.accountNumber || "-"}
              </div>
            </div>
          </>
        )}

        {/* Onchain-specific fields */}
        {destination === "onchain" && (
          <>
            <div className="grid grid-cols-2 items-center">
              <div className="text-[#4B5563] text-base">Chain</div>
              <div className="font-semibold text-right flex items-center justify-end gap-2">
                <div className="w-5 h-5 rounded-full bg-[#111827] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-sm bg-white transform rotate-45"></div>
                </div>
                <span>{network?.name || "-"}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-[#4B5563] text-base">Address</div>
              <div className="flex items-center justify-end gap-2">
                <span className="font-semibold font-mono text-sm">
                  {truncateAddress(transferAddress ?? null)}
                </span>
                {transferAddress && transferAddress !== "-" && (
                  <button
                    onClick={() => handleCopy(transferAddress, "address")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy address"
                  >
                    <Copy className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Transaction ID */}
        <div className="grid grid-cols-2 items-start">
          <div className="text-[#4B5563] text-base">Txid</div>
          <div className="flex items-start justify-end gap-2">
            <div className="text-right">
              {txid !== "-" && txid.length > 30 ? (
                <div className="font-semibold font-mono text-sm whitespace-pre-line break-all">
                  {formatTxHash(txid)}
                </div>
              ) : (
                <span className="font-semibold font-mono text-sm">{txid}</span>
              )}
            </div>
            {txid !== "-" && (
              <button
                onClick={() => handleCopy(txid, "txid")}
                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-0.5"
                title="Copy transaction ID"
              >
                <Copy className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Send Assets */}
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Send Assets</div>
          <div className="font-semibold text-right flex items-center justify-end gap-2">
            <Image
              src="/images/logo-mobile.png"
              width={20}
              height={20}
              alt="idra-coin-logo"
            />
            <span>
              {amountNum > 0
                ? amountNum.toLocaleString("id-ID", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.000"}
            </span>
          </div>
        </div>

        {/* Fee Estimate */}
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Fee Estimate</div>
          <div className="font-semibold text-right">
            {feeEstimate > 0 ? formatIDR(feeEstimate) : "Rp 0"}
          </div>
        </div>

        {/* Total Value */}
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Total Value</div>
          <div className="font-semibold text-right">
            {formatIDR(totalValue)}
          </div>
        </div>

        {/* Date */}
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Date</div>
          <div className="font-semibold text-right">{date}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2">
        <Button className="w-full" onClick={() => close()}>
          Download Transaction
        </Button>
      </div>
    </div>
  );
}
