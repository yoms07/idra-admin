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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
              <FormLabel>Recipient address</FormLabel>
              <FormControl>
                <Input
                  placeholder="0x... / 3YHh..."
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Paste the destination wallet address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="network"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network</FormLabel>
              <FormControl>
                <Select
                  value={(field.value as Network | null) ?? undefined}
                  onValueChange={(v) => field.onChange(v as Network)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                  </SelectContent>
                </Select>
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
              <FormDescription>Amount to send.</FormDescription>
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
