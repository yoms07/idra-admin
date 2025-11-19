"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { Button } from "@/components/ui/button";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import { useBankAccounts } from "@/features/bank-accounts/hooks/useBankAccounts";
import {
  useCreateWithdrawal,
  usePaymentMethods,
  useCheckFirstTime,
} from "@/features/withdrawal";
import { formatIDR, formatIDRA } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
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

  const { data: firstTimeData, isLoading: isCheckingFirstTime } =
    useCheckFirstTime(selectedAccount?.accountNumber);

  const isFirstTime = firstTimeData?.isFirstTime ?? false;
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  // Reset confirmation when account changes
  React.useEffect(() => {
    setIsConfirmed(false);
  }, [selectedAccount?.accountNumber]);

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
    // Require checkbox confirmation if it's first time
    if (isFirstTime && !isConfirmed) {
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
      form.setValue("transferId", null);
      form.setValue("otp", null);
      form.setValue("otpId", result.otp?.id ?? null);

      if (result.requiresOtp) {
        if (!result.otp?.id) {
          throw new Error("Missing OTP reference from server");
        }
        goNext();
      } else {
        goNext();
        goNext();
      }
    } catch (error) {
      console.error("Failed to create withdrawal:", error);
    }
  };

  const canConfirm =
    selectedAccount &&
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
          disabled={createWithdrawal.isPending || !canConfirm}
        >
          {createWithdrawal.isPending
            ? "Processing..."
            : isCheckingFirstTime
              ? "Checking..."
              : "Confirm"}
        </Button>
      </div>
    </div>
  );
}
