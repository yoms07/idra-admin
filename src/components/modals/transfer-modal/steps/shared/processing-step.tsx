"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import { useWithdrawalById } from "@/features/withdrawal";
import Image from "next/image";

export function ProcessingStep() {
  const form = useFormContext<TransferFormValues>();
  const { goNext } = useMultiStepModal();
  const withdrawalId = form.watch("withdrawalId");
  const amount = form.watch("amount");
  const amountNum = Number(amount ?? 0);

  const {
    data: withdrawal,
    refetch,
    isFetching,
  } = useWithdrawalById(withdrawalId || undefined);

  React.useEffect(() => {
    if (!withdrawal) return;

    if (withdrawal.status === "completed") {
      goNext();
    }
  }, [withdrawal?.status, goNext]);

  React.useEffect(() => {
    if (!withdrawalId) return;
    if (withdrawal?.status === "completed" || withdrawal?.status === "failed") {
      return;
    }

    const intervalId = setInterval(() => {
      if (!isFetching) {
        refetch();
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [withdrawalId, withdrawal?.status, isFetching, refetch]);

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
