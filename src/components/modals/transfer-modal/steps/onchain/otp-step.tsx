"use client";

import * as React from "react";
import { AxiosError } from "axios";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { Button } from "@/components/ui/button";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import { useConfirmTransfer } from "@/features/transfer/hooks/useTransfer";
import { TransferOtpErrorResponseSchema } from "@/features/transfer/schema/transfer";
import OtpInput from "react-otp-input";

const MIN_OTP_LENGTH = 6;

export function OnchainOtpStep() {
  const form = useFormContext<TransferFormValues>();
  const { goNext, goPrevious } = useMultiStepModal();
  const confirmTransfer = useConfirmTransfer();
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const transferId = form.watch("transferId");
  const otpId = form.watch("otpId");

  const getErrorMessage = (error: unknown) => {
    if (error instanceof AxiosError) {
      const parsed = TransferOtpErrorResponseSchema.safeParse(
        error.response?.data
      );
      if (parsed.success && parsed.data.error) {
        const attemptsLeft = parsed.data.error.details?.remainingAttempts;
        if (typeof attemptsLeft === "number") {
          return `${
            parsed.data.error.message ?? "Failed to verify OTP"
          } (${attemptsLeft} attempts left)`;
        }
        if (parsed.data.error.message) {
          return parsed.data.error.message;
        }
      }
    }
    return "Failed to verify OTP";
  };

  const submit = async () => {
    if (!value || value.length < MIN_OTP_LENGTH || !otpId || !transferId)
      return;
    setErrorMessage(null);
    try {
      await confirmTransfer.mutateAsync({
        transferId,
        otpId,
        code: value,
      });
      form.setValue("otp", value, { shouldDirty: true });
      form.setValue("otpId", null);
      setValue("");
      goNext();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const isSubmitting = confirmTransfer.isPending;
  const isDisabled =
    !otpId ||
    !transferId ||
    !value ||
    value.length < MIN_OTP_LENGTH ||
    isSubmitting;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Enter the 6-digit OTP sent to your email
        </div>
        <OtpInput
          value={value}
          onChange={(next) =>
            setValue(next.replace(/\D/g, "").slice(0, MIN_OTP_LENGTH))
          }
          numInputs={MIN_OTP_LENGTH}
          renderInput={(props) => (
            <input
              {...props}
              disabled={isSubmitting}
              className="!size-12 border border-[#A3A3A3] text-center text-base transition-all outline-none rounded-lg focus:border-ring focus:ring-ring/50 focus:ring-[3px] focus:z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          )}
          containerStyle={{
            display: "flex",
            gap: "0.5rem",
            margin: "16px 0",
            justifyContent: "center",
          }}
          inputType="tel"
          shouldAutoFocus
        />
        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline-secondary"
          onClick={goPrevious}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button onClick={submit} disabled={isDisabled}>
          {isSubmitting ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </div>
  );
}
