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
import DashboardSelect from "@/components/dashboard/select";
import InputText from "@/components/dashboard/input-text";
import { SelectItem } from "@/components/ui/select";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import { Building2, Link as LinkIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePaymentMethods } from "@/features/withdrawal";
import {
  useCreateBankAccount,
  useBankAccounts,
} from "@/features/bank-accounts/hooks/useBankAccounts";
import { Loader } from "@/components/common/Loader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { bankAccountService } from "@/features/bank-accounts/services/bankAccountService";

export function AddBankAccountStep() {
  const form = useFormContext<TransferFormValues>();
  const { goPrevious } = useMultiStepModal();
  const { data: paymentMethods, isLoading, error } = usePaymentMethods();
  const createAccount = useCreateBankAccount();
  const { refetch: refetchBankAccounts } = useBankAccounts();

  const paymentMethodType = form.watch("paymentMethodType");
  const newBankCode = form.watch("newBankCode");
  const newAccountNumber = form.watch("newAccountNumber");
  const newAccountHolderName = form.watch("newAccountHolderName");

  const choosePaymentMethod = (
    type: NonNullable<TransferFormValues["paymentMethodType"]>
  ) => {
    form.setValue("paymentMethodType", type, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue("newBankCode", null);
    form.setValue("newAccountNumber", null);
    form.setValue("newAccountHolderName", null);
  };

  const handleAddBankAccount = async () => {
    if (!paymentMethodType) {
      form.setError("paymentMethodType", {
        message: "Please select a payment method",
      });
      return;
    }

    if (paymentMethodType === "bank") {
      if (!newBankCode) {
        form.setError("newBankCode", { message: "Please select a bank" });
        return;
      }

      if (!newAccountHolderName || newAccountHolderName.trim() === "") {
        form.setError("newAccountHolderName", {
          message: "Account holder name is required",
        });
        return;
      }
    } else if (paymentMethodType === "e-wallet") {
      if (!newBankCode) {
        form.setError("newBankCode", { message: "Please select an e-wallet" });
        return;
      }
    }

    if (!newAccountNumber || newAccountNumber.trim() === "") {
      form.setError("newAccountNumber", {
        message: "Account number is required",
      });
      return;
    }

    try {
      const selectedPaymentMethod = paymentMethods?.find(
        (pm) => pm.bankCode === newBankCode
      );
      if (!selectedPaymentMethod) {
        form.setError("newBankCode", {
          message: "Invalid payment method selected",
        });
        return;
      }

      const newAccount = await createAccount.mutateAsync({
        bankCode: selectedPaymentMethod.bankCode,
        accountNumber: newAccountNumber.trim(),
        accountHolderName:
          paymentMethodType === "bank"
            ? newAccountHolderName?.trim() || ""
            : "E-Wallet Account",
        isDefault: false,
      });

      await refetchBankAccounts();

      form.setValue("bankAccountId", newAccount.id, {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue("paymentMethodType", null);
      form.setValue("newBankCode", null);
      form.setValue("newAccountNumber", null);
      form.setValue("newAccountHolderName", null);

      goPrevious();
    } catch (error) {
      console.error("Failed to create bank account:", error);
      form.setError("root", {
        message: "Failed to add bank account. Please try again.",
      });
    }
  };

  const filteredPaymentMethods = React.useMemo(() => {
    if (!paymentMethods) return [];
    if (paymentMethodType === "bank") {
      return paymentMethods.filter(
        (pm) => !bankAccountService.isEWallet(pm.bankCode)
      );
    } else if (paymentMethodType === "e-wallet") {
      return paymentMethods.filter((pm) =>
        bankAccountService.isEWallet(pm.bankCode)
      );
    }
    return [];
  }, [paymentMethods, paymentMethodType]);

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
        <ErrorMessage message="Failed to load payment methods. Please try again." />
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="space-y-6 font-manrope">
        <div className="grid grid-cols-2 gap-4">
          <div
            role="button"
            onClick={() => choosePaymentMethod("bank")}
            className={cn(
              "p-4 flex items-center gap-4 border-1 transition-colors cursor-pointer rounded-lg",
              paymentMethodType === "bank"
                ? "border-primary-600"
                : "border-[#E2E8F0] hover:border-primary-600"
            )}
          >
            <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-12">
              <Building2 className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">Bank</div>
            </div>
            <ChevronRight className="text-muted-foreground" />
          </div>

          <div
            role="button"
            onClick={() => choosePaymentMethod("e-wallet")}
            className={cn(
              "p-4 flex items-center gap-4 border-1 transition-colors cursor-pointer rounded-lg",
              paymentMethodType === "e-wallet"
                ? "border-primary-600"
                : "border-[#E2E8F0] hover:border-primary-600"
            )}
          >
            <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-12">
              <LinkIcon className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">E-Wallet</div>
            </div>
            <ChevronRight className="text-muted-foreground" />
          </div>
        </div>

        {paymentMethodType && (
          <div className="space-y-4">
            {paymentMethodType === "bank" && (
              <>
                <FormField
                  control={form.control}
                  name="newBankCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DashboardSelect
                          label="Bank Name"
                          value={field.value ?? undefined}
                          onValueChange={(v) => field.onChange(v)}
                          placeholder="Select bank name"
                        >
                          {filteredPaymentMethods.map((pm) => (
                            <SelectItem key={pm.bankCode} value={pm.bankCode}>
                              {pm.bankName}
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
                  name="newAccountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          label="Account Holder Name"
                          value={field.value ?? ""}
                          onChange={(v) => field.onChange(v)}
                          placeholder="Enter account holder name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {paymentMethodType === "e-wallet" && (
              <FormField
                control={form.control}
                name="newBankCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DashboardSelect
                        label="E-Wallet"
                        value={field.value ?? undefined}
                        onValueChange={(v) => field.onChange(v)}
                        placeholder="Select e-wallet"
                      >
                        {filteredPaymentMethods.map((pm) => (
                          <SelectItem key={pm.bankCode} value={pm.bankCode}>
                            {pm.bankName}
                          </SelectItem>
                        ))}
                      </DashboardSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="newAccountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputText
                      label="Account Number"
                      value={field.value ?? ""}
                      onChange={(v) => field.onChange(v)}
                      placeholder="Enter account number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {form.formState.errors.root && (
          <ErrorMessage message={form.formState.errors.root.message} />
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={goPrevious}>
            Back
          </Button>
          <Button
            onClick={handleAddBankAccount}
            disabled={
              createAccount.isPending ||
              !paymentMethodType ||
              !newBankCode ||
              !newAccountNumber ||
              (paymentMethodType === "bank" && !newAccountHolderName)
            }
          >
            {createAccount.isPending ? "Adding..." : "Add Bank Account"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
