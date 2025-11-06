"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  MultiStepModal,
  type MultiStep,
} from "@/components/modals/multi-step-modal";

import { ChooseDestinationStep } from "./steps/choose-destination-step";
import { OnchainInputStep } from "./steps/onchain/input-step";
import { OnchainConfirmStep } from "./steps/onchain/confirm-step";
import { OtpStep } from "./steps/shared/otp-step";
import { ProcessingStep } from "./steps/shared/processing-step";
import { SuccessStep } from "./steps/shared/success-step";
import { BankSelectStep } from "./steps/bank/select-account-step";
import { BankConfirmStep } from "./steps/bank/confirm-step";

export type TransferDestination = "bank" | "onchain";
export type Network = "ethereum" | "polygon" | "solana";

export type TransferFormValues = {
  destination: TransferDestination | null;
  amount: number | null;
  // onchain specifics
  address?: string | null;
  network?: Network | null;
  // bank specifics
  bankAccountId?: string | null; // "add" means add new account
  // OTP
  otp?: string | null;
};

export type TransferModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

export function TransferModal({
  open,
  onOpenChange,
  className,
}: TransferModalProps) {
  const [instance, setInstance] = React.useState(0);
  const form = useForm<TransferFormValues>({
    defaultValues: {
      destination: null,
      amount: null,
      address: null,
      network: null,
      bankAccountId: null,
      otp: null,
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (open) setInstance((n) => n + 1);
  }, [open]);

  const destination = form.watch("destination");

  const sourceStep: MultiStep = {
    id: "choose",
    title: "What type of transfer are you making today?",
    content: <ChooseDestinationStep />,
    showProgress: true,
    renderFooter: ({ goNext }) => {
      const canProceed = !!form.watch("destination");
      return (
        <div className="flex w-full items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={goNext} disabled={!canProceed}>
            Next
          </Button>
        </div>
      );
    },
  };

  const steps = React.useMemo<MultiStep[]>(() => {
    if (destination === "onchain") {
      return [
        sourceStep,
        {
          id: "on-input",
          title: "Send on-chain",
          content: <OnchainInputStep />,
        },
        {
          id: "on-confirm",
          title: "Confirm transfer",
          content: <OnchainConfirmStep />,
        },
        { id: "otp", title: "Verify OTP", content: <OtpStep /> },
        { id: "processing", title: "Processing", content: <ProcessingStep /> },
        { id: "success", title: "Success", content: <SuccessStep /> },
      ];
    }
    if (destination === "bank") {
      return [
        sourceStep,
        {
          id: "bank-select",
          title: "Withdraw to bank",
          content: <BankSelectStep />,
        },
        {
          id: "bank-confirm",
          title: "Confirm transfer",
          content: <BankConfirmStep />,
        },
        { id: "otp", title: "Verify OTP", content: <OtpStep /> },
        { id: "processing", title: "Processing", content: <ProcessingStep /> },
        { id: "success", title: "Success", content: <SuccessStep /> },
      ];
    }
    return [sourceStep];
  }, [destination]);

  return (
    <FormProvider {...form}>
      <MultiStepModal
        key={`transfer-${instance}`}
        open={open}
        onOpenChange={(o) => {
          if (!o) form.reset();
          onOpenChange(o);
        }}
        steps={steps}
        showNavigation={false}
        className={className}
      />
    </FormProvider>
  );
}

export default TransferModal;
