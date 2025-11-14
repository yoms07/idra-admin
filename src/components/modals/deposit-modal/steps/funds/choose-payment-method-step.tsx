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
import Image from "next/image";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import type { DepositFormValues } from "../../deposit-modal";
import {
  useCreateDeposit,
  usePaymentMethods,
  type DepoistPaymentMethod,
} from "@/features/deposit";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Loader } from "@/components/common/Loader";

// Check if payment method is QRIS
function isQRIS(depositPaymentType: string): boolean {
  return depositPaymentType.toLowerCase().includes("qris");
}

export function ChoosePaymentMethodStep() {
  const form = useFormContext<DepositFormValues>();
  const { goNext, goPrevious } = useMultiStepModal();
  const createDeposit = useCreateDeposit();
  const {
    data: paymentMethods,
    isLoading,
    error: paymentMethodsError,
  } = usePaymentMethods();

  // Store selected payment method data
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState<DepoistPaymentMethod | null>(null);

  const selectedPaymentMethodValue = form.watch("paymentMethod");
  const amount = form.watch("amount");

  // Update selected payment method when form value changes
  React.useEffect(() => {
    if (paymentMethods && selectedPaymentMethodValue) {
      const method = paymentMethods.find(
        (pm) => pm.depositPaymentType === selectedPaymentMethodValue
      );
      setSelectedPaymentMethod(method || null);
    } else {
      setSelectedPaymentMethod(null);
    }
  }, [selectedPaymentMethodValue, paymentMethods]);

  const onNext = async () => {
    const raw = form.getValues();
    const amountNum = Number(raw.amount ?? 0);

    let valid = true;
    if (!raw.paymentMethod) {
      form.setError("paymentMethod", { message: "Select a payment method" });
      valid = false;
    }
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      form.setError("amount", { message: "Amount must be greater than 0" });
      valid = false;
    }

    // Validate amount against selected payment method's min/max
    if (selectedPaymentMethod && valid) {
      if (amountNum < selectedPaymentMethod.minimumAmount) {
        form.setError("amount", {
          message: `Minimum amount is Rp ${selectedPaymentMethod.minimumAmount.toLocaleString("id-ID")}`,
        });
        valid = false;
      }
      if (amountNum > selectedPaymentMethod.maximumAmount) {
        form.setError("amount", {
          message: `Maximum amount is Rp ${selectedPaymentMethod.maximumAmount.toLocaleString("id-ID")}`,
        });
        valid = false;
      }
    }

    if (!valid) return;

    try {
      const depositData = await createDeposit.mutateAsync({
        originalAmount: amountNum.toString(),
        currency: "IDR",
        paymentMethod: raw.paymentMethod!,
      });

      // Store deposit data in form
      form.setValue("depositId", depositData.id, { shouldDirty: true });
      form.setValue("depositData", depositData, { shouldDirty: true });

      // Also set legacy fields for backward compatibility
      const isQris = isQRIS(depositData.paymentMethod);
      if (isQris) {
        const qrisInstructions = depositData.paymentInstructions;
        if ("qrData" in qrisInstructions) {
          form.setValue("qrisPayload", qrisInstructions.qrData, {
            shouldDirty: true,
          });
        }
        form.setValue("vaNumber", null);
      } else {
        const vaInstructions = depositData.paymentInstructions;
        if ("accountNumber" in vaInstructions) {
          form.setValue("vaNumber", vaInstructions.accountNumber, {
            shouldDirty: true,
          });
        }
        form.setValue("qrisPayload", null);
      }

      goNext();
    } catch (error) {
      console.error("Failed to create deposit:", error);
      form.setError("root", {
        message: "Failed to create deposit. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (paymentMethodsError || !paymentMethods || paymentMethods.length === 0) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          message={
            paymentMethodsError
              ? "Failed to load payment methods. Please try again."
              : "No payment methods available."
          }
        />
      </div>
    );
  }

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
                  placeholder="Select payment method"
                >
                  {paymentMethods.map((pm) => (
                    <SelectItem key={pm.bankCode} value={pm.bankCode}>
                      <span className="flex items-center gap-2">
                        {pm.image ? (
                          <Image
                            src={pm.image}
                            alt={pm.bankName}
                            width={30}
                            height={30}
                            className="object-contain rounded"
                          />
                        ) : null}
                        <span>{pm.bankName.toUpperCase()}</span>
                      </span>
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

        {form.formState.errors.root && (
          <ErrorMessage message={form.formState.errors.root.message} />
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline-secondary" onClick={goPrevious}>
            Back
          </Button>
          <Button
            variant="default"
            onClick={onNext}
            disabled={createDeposit.isPending}
          >
            {createDeposit.isPending ? "Creating..." : "Continue"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
