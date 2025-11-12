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
import InputText from "@/components/dashboard/input-text";
import { SelectItem } from "@/components/ui/select";
import DashboardSelect from "@/components/dashboard/select";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import { isValidEthereumAddress } from "@/lib/utils";
import { useSupportedChains } from "@/features/transfer/hooks/useTransfer";

export function OnchainInputStep() {
  const form = useFormContext<TransferFormValues>();
  const { goNext } = useMultiStepModal();

  const { data: supportedChains, isLoading: isLoadingChains } =
    useSupportedChains();

  const proceed = () => {
    const v = form.getValues();
    let valid = true;

    if (!v.address || v.address.trim() === "") {
      form.setError("address", { message: "Enter a valid address" });
      valid = false;
    } else if (!isValidEthereumAddress(v.address.trim())) {
      form.setError("address", {
        message: "Invalid Ethereum address format",
      });
      valid = false;
    }

    if (!v.chainId) {
      form.setError("chainId", { message: "Choose a network" });
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

  // Show loading state while fetching chains
  if (isLoadingChains) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading networks...</div>
      </div>
    );
  }

  // Show error if no supported chains
  if (!isLoadingChains && (supportedChains || []).length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">
          No supported networks available. Please try again later.
        </div>
      </div>
    );
  }

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
          name="chainId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DashboardSelect
                  label="Network"
                  value={field.value?.toString()}
                  onValueChange={(v) => field.onChange(Number(v))}
                  placeholder="Select a network"
                >
                  {(supportedChains || []).map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.name}
                    </SelectItem>
                  ))}
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
