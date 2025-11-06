"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";

export function OtpStep() {
  const form = useFormContext<TransferFormValues>();
  const { goNext, goPrevious } = useMultiStepModal();
  const [value, setValue] = React.useState("");

  const submit = () => {
    if (!value || value.length < 4) return;
    form.setValue("otp", value, { shouldDirty: true });
    goNext();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Enter the OTP sent to your device
        </div>
        <Input
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="000000"
        />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={goPrevious}>
          Back
        </Button>
        <Button onClick={submit} disabled={!value || value.length < 4}>
          Verify
        </Button>
      </div>
    </div>
  );
}
