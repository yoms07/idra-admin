"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { Button } from "@/components/ui/button";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import { useBankAccounts } from "@/features/bank-accounts/hooks/useBankAccounts";
import { useCreateWithdrawal, usePaymentMethods } from "@/features/withdrawal";
import { formatIDR, formatIDRA } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function BankConfirmStep() {
  const form = useFormContext<TransferFormValues>();
  const { goNext, goPrevious } = useMultiStepModal();
  const { bankAccountId, amount } = form.getValues();
  const { data: accounts } = useBankAccounts();
  const { data: paymentMethods } = usePaymentMethods();
  const createWithdrawal = useCreateWithdrawal();

  const selectedAccount = accounts?.find((a) => a.id === bankAccountId);
  const amountNum = Number(amount ?? 0);

  const selectedPaymentMethod = React.useMemo(() => {
    if (!selectedAccount || !paymentMethods) return null;
    return paymentMethods.find(
      (pm) =>
        pm.bankCode.toLowerCase() === selectedAccount.bankName.toLowerCase() ||
        pm.bankName.toLowerCase() === selectedAccount.bankName.toLowerCase()
    );
  }, [selectedAccount, paymentMethods]);

  const feeEstimate = React.useMemo(() => {
    if (!selectedPaymentMethod || !amountNum) return 0;
    const flatFee = selectedPaymentMethod.feeFlat || 0;
    const percentageFee =
      (amountNum * (selectedPaymentMethod.feePercentage || 0)) / 100;
    return flatFee + percentageFee;
  }, [selectedPaymentMethod, amountNum]);

  const totalValue = amountNum;
  const idraAmount = amountNum;

  const onConfirm = async () => {
    if (!selectedAccount) {
      return;
    }
    if (amountNum <= 0) {
      return;
    }
    try {
      const result = await createWithdrawal.mutateAsync({
        originalAmount: String(amountNum),
        currency: "IDR",
        recipient: {
          bankCode: selectedAccount.bankCode,
          bankName: selectedAccount.bankName,
          accountName: selectedAccount.accountHolderName,
          accountNumber: selectedAccount.accountNumber,
        },
      });
      form.setValue("withdrawalId", result.withdrawalId);
      goNext();
    } catch (error) {
      console.error("Failed to create withdrawal:", error);
    }
  };

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
          <span className="text-[#4B5563]">Bank Account</span>
          <div className="text-right">
            {selectedAccount ? (
              <>
                <div className="font-semibold text-base">
                  {selectedAccount.accountHolderName}
                </div>
                <div className="text-sm text-[#111827]">
                  {selectedAccount.bankName} ••••{" "}
                  {selectedAccount.accountNumberLast4}
                </div>
              </>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        </div>
        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563]">Fee Estimate</span>
          <span className="font-semibold">
            {feeEstimate > 0 ? formatIDR(feeEstimate) : "$0"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#4B5563] text-base">Estimated Time</span>
          <span className="font-semibold">~30s</span>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goPrevious}>
          Back
        </Button>
        <Button
          onClick={onConfirm}
          disabled={createWithdrawal.isPending || !selectedAccount}
        >
          {createWithdrawal.isPending ? "Processing..." : "Confirm"}
        </Button>
      </div>
    </div>
  );
}
