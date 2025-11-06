"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";

export function SuccessStep() {
  const { reset } = useFormContext<TransferFormValues>();
  return (
    <div className="space-y-4">
      <div className="p-6 space-y-2 text-center border rounded-lg">
        <div className="text-lg font-semibold">Transfer successful</div>
        <div className="text-sm text-muted-foreground">
          Your transfer was submitted successfully.
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => reset()}>Done</Button>
      </div>
    </div>
  );
}
