"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputAmount from "@/components/dashboard/input-amount";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import DashboardSelect from "@/components/dashboard/select";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import type { DepositFormValues } from "../../deposit-modal";

export function ChoosePaymentMethodStep() {
  const form = useFormContext<DepositFormValues>();
  const { goNext } = useMultiStepModal();

  const onNext = () => {
    const raw = form.getValues();
    const amountNum = Number(raw.amount ?? 0);

    let valid = true;
    if (!raw.paymentMethod) {
      form.setError("paymentMethod", { message: "Select a method" });
      valid = false;
    }
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      form.setError("amount", { message: "Amount must be greater than 0" });
      valid = false;
    }
    if (!valid) return;

    if (raw.paymentMethod === "va") {
      const va = `8888${Math.floor(10000000 + Math.random() * 89999999)}`;
      form.setValue("vaNumber", va, { shouldDirty: true });
      form.setValue("qrisPayload", null);
    } else if (raw.paymentMethod === "qris") {
      const payload = `IDRA|QRIS|AMT:${amountNum}`;
      form.setValue("qrisPayload", payload, { shouldDirty: true });
      form.setValue("vaNumber", null);
    }

    goNext();
  };

  return (
    <Form {...(form as any)}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DashboardSelect
                  label="Method"
                  value={field.value ?? undefined}
                  onValueChange={(v) => field.onChange(v)}
                  placeholder="Select method"
                >
                  <SelectItem value="qris">QRIS (QR Payment)</SelectItem>
                  <SelectItem value="va">Virtual Account (VA)</SelectItem>
                </DashboardSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputAmount
                  value={field.value ?? ""}
                  onChange={(v) => field.onChange(v)}
                  label="Amount"
                  currency="IDR"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="default" onClick={onNext}>
            Continue
          </Button>
        </div>
      </div>
    </Form>
  );
}
