"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import InputText from "@/components/dashboard/input-text";
import InputAmount from "@/components/dashboard/input-amount";
import { usePullIdra } from "../hooks/useUser";
import { toast } from "sonner";
import { isValidEthereumAddress } from "@/lib/utils";

interface PullIdraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  chainId: number;
  chainName: string;
}

type PullIdraFormValues = {
  recipientAddress: string;
  amount: number | null;
};

export function PullIdraModal({
  open,
  onOpenChange,
  userId,
  userName,
  chainId,
  chainName,
}: PullIdraModalProps) {
  const { mutateAsync: pullIdra, isPending } = usePullIdra();
  const form = useForm<PullIdraFormValues>({
    defaultValues: {
      recipientAddress: "",
      amount: null,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    const values = form.getValues();
    let valid = true;

    if (!values.recipientAddress || values.recipientAddress.trim() === "") {
      form.setError("recipientAddress", { message: "Enter a valid address" });
      valid = false;
    } else if (!isValidEthereumAddress(values.recipientAddress.trim())) {
      form.setError("recipientAddress", {
        message: "Invalid Ethereum address format",
      });
      valid = false;
    }

    if (!values.amount || values.amount <= 0) {
      form.setError("amount", { message: "Amount must be greater than 0" });
      valid = false;
    }

    if (!valid) return;

    try {
      const result = await pullIdra({
        userId,
        chainId,
        amount: values.amount?.toString() ?? "",
        recipientAddress: values.recipientAddress.trim(),
      });
      toast.success(result.data.message || "IDRA pulled successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to pull IDRA. Please try again.");
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Pull IDRA - {chainName}</DialogTitle>
          <DialogDescription>
            Pull IDRA from {userName}'s onchain balance on {chainName}
          </DialogDescription>
        </DialogHeader>

        <Form {...(form as any)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="recipientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputText
                      label="Recipient Address"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="0x..."
                      disabled={isPending}
                    />
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
                      label="Amount"
                      value={field.value ?? null}
                      onChange={field.onChange}
                      currency="IDRA"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? "Pulling..." : "Pull IDRA"}
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
