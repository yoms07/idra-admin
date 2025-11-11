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
  FormMessage,
} from "@/components/ui/form";
import InputAmount from "@/components/dashboard/input-amount";
import { SelectItem } from "@/components/ui/select";
import DashboardSelect from "@/components/dashboard/select";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import { useBankAccounts } from "@/features/bank-accounts/hooks/useBankAccounts";
import { Loader } from "@/components/common/Loader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useMe } from "@/features/auth/hooks/authHook";

export function BankSelectStep() {
  const form = useFormContext<TransferFormValues>();
  const { goNext } = useMultiStepModal();
  const { data: accounts, isLoading, error } = useBankAccounts();
  const { data: me } = useMe();

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
    // Validate against offchain balance (from auth/me)
    const offchainBalance = Number(me?.offchainBalance ?? "0");
    if (Number.isFinite(amt) && amt > offchainBalance) {
      form.setError("amount", {
        message: `Amount exceeds available balance (max ${offchainBalance.toLocaleString(
          "id-ID"
        )})`,
      });
      valid = false;
    }
    if (!valid) return;
    goNext();
  };

  const handleBankAccountChange = (value: string) => {
    form.setValue("bankAccountId", value, { shouldDirty: true });
    if (value === "add") {
      goNext();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message="Failed to load bank accounts. Please try again." />
      </div>
    );
  }

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
                  label="To"
                  value={field.value ?? undefined}
                  onValueChange={handleBankAccountChange}
                  placeholder="Select a bank account"
                >
                  {(accounts || []).map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.accountHolderName} - {account.bankName}••••{" "}
                      {account.accountNumberLast4}
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
