"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { useWithdrawalById } from "@/features/withdrawal";
import { useBankAccounts } from "@/features/bank-accounts/hooks/useBankAccounts";
import { usePaymentMethods } from "@/features/withdrawal";
import { formatIDR, formatIDRA } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";

export function SuccessStep() {
  const form = useFormContext<TransferFormValues>();
  const { close } = useMultiStepModal();
  const withdrawalId = form.watch("withdrawalId");
  const { data: withdrawal, isLoading } = useWithdrawalById(
    withdrawalId || undefined
  );
  const { data: accounts } = useBankAccounts();
  const { data: paymentMethods } = usePaymentMethods();

  const amount = form.watch("amount");
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
  const feeEstimate = React.useMemo(() => {
    if (!selectedPaymentMethod || !amountNum) return 0;
    const flatFee = selectedPaymentMethod.feeFlat || 0;
    const percentageFee =
      (amountNum * (selectedPaymentMethod.feePercentage || 0)) / 100;
    return flatFee + percentageFee;
  }, [selectedPaymentMethod, amountNum]);

  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const date = withdrawal?.createdAt
    ? new Date(withdrawal.createdAt).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  const txid = withdrawal?.id || "-";
  const bankName = selectedAccount?.bankName || "-";
  const accountName = selectedAccount?.accountHolderName || "-";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-semibold">Transferred Details</h3>
        <div className="h-px bg-border" />
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
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Crypto transferred out of platform. Please contact the recipient
          platform for your transaction receipt.
        </p>
        <div className="h-px bg-border mt-2" />
      </div>

      {/* Checkmark icon */}
      <div className="flex items-center justify-center py-8">
        <div className="w-32 h-32 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-6xl">
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
          <div className="flex items-center justify-end gap-2">
            <span className="font-semibold">{txid}</span>
            {txid !== "-" && (
              <button
                onClick={() => handleCopy(txid)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Copy transaction ID"
              >
                <Copy className="size-4" />
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Send Assets</div>
          <div className="font-semibold text-right flex items-center justify-end gap-2">
            <span className="text-lg">A</span>
            <span>
              {amountNum > 0
                ? amountNum.toLocaleString("id-ID", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : "0"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Fee Estimate</div>
          <div className="font-semibold text-right">
            {feeEstimate > 0 ? formatIDR(feeEstimate) : "Rp 0"}
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <div className="text-[#4B5563] text-base">Total Value</div>
          <div className="font-semibold text-right">
            {formatIDR(totalValue)}
          </div>
        </div>
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
