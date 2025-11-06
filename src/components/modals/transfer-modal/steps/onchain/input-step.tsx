"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues, Network } from "../../transfer-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputAmount from "@/components/dashboard/input-amount";
import InputText from "@/components/dashboard/input-text";
import { SelectItem } from "@/components/ui/select";
import DashboardSelect from "@/components/dashboard/select";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";

export function OnchainInputStep() {
  const form = useFormContext<TransferFormValues>();
  const { goNext } = useMultiStepModal();

  const proceed = () => {
    const v = form.getValues();
    let valid = true;
    if (!v.address || v.address.length < 6) {
      form.setError("address", { message: "Enter a valid address" });
      valid = false;
    }
    if (!v.network) {
      form.setError("network", { message: "Choose a network" });
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputText
                  label="To"
                  value={field.value ?? ""}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Input address.."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="network"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DashboardSelect
                  label="Network"
                  value={(field.value as Network | null) ?? undefined}
                  onValueChange={(v) => field.onChange(v as Network)}
                  placeholder="Select a network"
                >
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
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
          <Button onClick={proceed}>Continue</Button>
        </div>
      </div>
    </Form>
  );
}
