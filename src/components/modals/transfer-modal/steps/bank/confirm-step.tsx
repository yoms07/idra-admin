"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { Button } from "@/components/ui/button";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";

export function BankConfirmStep() {
  const form = useFormContext<TransferFormValues>();
  const { goNext, goPrevious } = useMultiStepModal();
  const { bankAccountId, amount } = form.getValues();

  return (
    <div className="space-y-6">
      <div className="space-y-2 p-4 border rounded-lg">
        <Row label="Destination" value={bankAccountId || "-"} />
        <Row label="Amount" value={String(amount ?? "-")} />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={goPrevious}>
          Back
        </Button>
        <Button onClick={goNext}>Confirm</Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
