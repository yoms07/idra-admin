"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader } from "@/components/common/Loader";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import {
  useBankAccounts,
  useCreateBankAccount,
} from "@/features/bank-accounts/hooks/useBankAccounts";
import { usePaymentMethods } from "@/features/withdrawal";
import { bankAccountService } from "@/features/bank-accounts/services/bankAccountService";
import { cn } from "@/lib/utils";
import { Building2, ChevronRight, Link as LinkIcon } from "lucide-react";

export type AddBankAccountFormValues = {
  paymentMethodType: "bank" | "e-wallet" | null;
  newBankCode: string | null;
  newAccountNumber: string | null;
  newAccountHolderName: string | null;
};

type AddBankAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddBankAccountModal({
  open,
  onOpenChange,
}: AddBankAccountModalProps) {
  const form = useForm<AddBankAccountFormValues>({
    defaultValues: {
      paymentMethodType: null,
      newBankCode: null,
      newAccountNumber: null,
      newAccountHolderName: null,
    },
  });

  const { data: paymentMethods, isLoading, error } = usePaymentMethods();
  const { refetch: refetchBankAccounts } = useBankAccounts();
  const createAccount = useCreateBankAccount();

  const paymentMethodType = form.watch("paymentMethodType");
  const newBankCode = form.watch("newBankCode");
  const newAccountNumber = form.watch("newAccountNumber");
  const newAccountHolderName = form.watch("newAccountHolderName");

  const closeAndReset = () => {
    onOpenChange(false);
    form.reset();
  };

  const choosePaymentMethod = (
    type: NonNullable<AddBankAccountFormValues["paymentMethodType"]>
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

    if (paymentMethodType === "bank" && !newBankCode) {
      form.setError("newBankCode", { message: "Please select a bank" });
      return;
    }

    if (paymentMethodType === "bank" && !newAccountHolderName?.trim()) {
      form.setError("newAccountHolderName", {
        message: "Account holder name is required",
      });
      return;
    }

    if (!newBankCode) {
      form.setError("newBankCode", {
        message:
          paymentMethodType === "bank"
            ? "Please select a bank"
            : "Please select an e-wallet",
      });
      return;
    }

    if (!newAccountNumber?.trim()) {
      form.setError("newAccountNumber", {
        message: "Account number is required",
      });
      return;
    }

    const selectedPaymentMethod = paymentMethods?.find(
      (pm) => pm.bankCode === newBankCode
    );

    if (!selectedPaymentMethod) {
      form.setError("newBankCode", {
        message: "Invalid payment method selected",
      });
      return;
    }

    try {
      await createAccount.mutateAsync({
        bankCode: selectedPaymentMethod.bankCode,
        accountNumber: newAccountNumber.trim(),
        accountHolderName:
          paymentMethodType === "bank"
            ? newAccountHolderName?.trim() || ""
            : "E-Wallet Account",
        isDefault: false,
      });

      await refetchBankAccounts();
      closeAndReset();
    } catch (e) {
      console.error(e);
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
    }
    if (paymentMethodType === "e-wallet") {
      return paymentMethods.filter((pm) =>
        bankAccountService.isEWallet(pm.bankCode)
      );
    }
    return [];
  }, [paymentMethods, paymentMethodType]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              role="button"
              onClick={() => choosePaymentMethod("bank")}
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors",
                paymentMethodType === "bank"
                  ? "border-primary-600"
                  : "border-[#E2E8F0] hover:border-primary-600"
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Building2 className="size-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Bank</p>
              </div>
              <ChevronRight className="text-muted-foreground" />
            </div>

            <div
              role="button"
              onClick={() => choosePaymentMethod("e-wallet")}
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors",
                paymentMethodType === "e-wallet"
                  ? "border-primary-600"
                  : "border-[#E2E8F0] hover:border-primary-600"
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LinkIcon className="size-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">E-Wallet</p>
              </div>
              <ChevronRight className="text-muted-foreground" />
            </div>
          </div>

          {paymentMethodType && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="newBankCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DashboardSelect
                        label={
                          paymentMethodType === "bank"
                            ? "Bank Name"
                            : "E-Wallet"
                        }
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                        placeholder="Select an option"
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

              {paymentMethodType === "bank" && (
                <FormField
                  control={form.control}
                  name="newAccountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputText
                          label="Account Holder Name"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Enter account holder name"
                        />
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
                        onChange={field.onChange}
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

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeAndReset}>
              Cancel
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

export default AddBankAccountModal;
