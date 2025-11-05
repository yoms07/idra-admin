"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
              <FormLabel>Payment method</FormLabel>
              <FormControl>
                <Select
                  value={field.value ?? undefined}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qris">QRIS (QR Payment)</SelectItem>
                    <SelectItem value="va">Virtual Account (VA)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Choose your preferred rails.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  placeholder="0.00"
                />
              </FormControl>
              <FormDescription>Amount to deposit.</FormDescription>
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
