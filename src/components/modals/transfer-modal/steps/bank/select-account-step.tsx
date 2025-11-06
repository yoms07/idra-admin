"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../../transfer-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputAmount from "@/components/dashboard/input-amount";
import { SelectItem } from "@/components/ui/select";
import DashboardSelect from "@/components/dashboard/select";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";

const MOCK_ACCOUNTS = [
  { id: "bca-001", label: "BCA •••• 1234 (Jason)" },
  { id: "bri-002", label: "BRI •••• 9876 (Jason)" },
];

export function BankSelectStep() {
  const form = useFormContext<TransferFormValues>();
  const { goNext } = useMultiStepModal();

  const continueNext = () => {
    const v = form.getValues();
    let valid = true;
    if (!v.bankAccountId) {
      form.setError("bankAccountId", { message: "Select a bank account" });
      valid = false;
    }
    const amt = Number(v.amount ?? 0);
    if (!Number.isFinite(amt) || amt <= 0) {
      form.setError("amount", { message: "Amount must be greater than 0" });
      valid = false;
    }
    if (!valid) return;
    goNext();
  };

  return (
    <Form {...(form as any)}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="bankAccountId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DashboardSelect
                  label="Bank account"
                  value={field.value ?? undefined}
                  onValueChange={(v) => field.onChange(v)}
                  placeholder="Select a bank account"
                >
                  {MOCK_ACCOUNTS.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="add">+ Add new bank account…</SelectItem>
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

        <div className="flex justify-end">
          <Button onClick={continueNext}>Continue</Button>
        </div>
      </div>
    </Form>
  );
}
