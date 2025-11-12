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
import { OnchainProcessingStep } from "./steps/onchain/processing-step";
import { OtpStep } from "./steps/shared/otp-step";
import { ProcessingStep } from "./steps/shared/processing-step";
import { SuccessStep } from "./steps/shared/success-step";
import { BankSelectStep } from "./steps/bank/select-account-step";
import { BankConfirmStep } from "./steps/bank/confirm-step";
import { AddBankAccountStep } from "./steps/bank/add-bank-account-step";

export type TransferDestination = "bank" | "onchain";

export type TransferFormValues = {
  destination: TransferDestination | null;
  amount: number | null;
  // onchain specifics
  address?: string | null;
  chainId?: number | null;
  // bank specifics
  bankAccountId?: string | null; // "add" means add new account
  paymentMethodType?: "bank" | "e-wallet" | null;
  newBankCode?: string | null;
  newAccountNumber?: string | null;
  newAccountHolderName?: string | null;
  // OTP
  otp?: string | null;
  // Withdrawal ID after creation
  withdrawalId?: string | null;
  // Transfer ID after creation
  transferId?: string | null;
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
      chainId: null,
      bankAccountId: null,
      paymentMethodType: "bank",
      newBankCode: null,
      newAccountNumber: null,
      newAccountHolderName: null,
      otp: null,
      withdrawalId: null,
      transferId: null,
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (open) setInstance((n) => n + 1);
  }, [open]);

  const destination = form.watch("destination");
  const bankAccountId = form.watch("bankAccountId");

  const sourceStep: MultiStep = {
    id: "choose",
    title: "What type of transfer are you making today?",
    content: <ChooseDestinationStep />,
    showProgressBar: true,
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
          title: "Are you sure want to transfer your Assets?",
          content: <OnchainConfirmStep />,
        },
        { id: "otp", title: "Verify OTP", content: <OtpStep /> },
        {
          id: "processing",
          title: "Processing",
          content: <OnchainProcessingStep />,
        },
        { id: "success", title: "Success", content: <SuccessStep /> },
      ];
    }
    if (destination === "bank") {
      const steps: MultiStep[] = [
        sourceStep,
        {
          id: "bank-select",
          title: "Withdraw to bank",
          content: <BankSelectStep />,
        },
      ];

      if (bankAccountId === "add") {
        steps.push({
          id: "bank-add",
          title: "Add Bank Account",
          content: <AddBankAccountStep />,
        });
      } else {
        steps.push(
          {
            id: "bank-confirm",
            title: "Are you sure want to transfer your Assets?",
            content: <BankConfirmStep />,
          },
          { id: "otp", title: "Verify OTP", content: <OtpStep /> },
          {
            id: "processing",
            title: "Processing",
            content: <ProcessingStep />,
          },
          { id: "success", title: "Success", content: <SuccessStep /> }
        );
      }

      return steps;
    }
    return [sourceStep];
  }, [destination, bankAccountId]);

  return (
    <FormProvider {...form}>
      <MultiStepModal
        key={`transfer-${instance}`}
        open={open}
        onOpenChange={(o) => {
          if (!o) form.reset();
          onOpenChange(o);
        }}
        showProgressBar
        showProgressStep={false}
        steps={steps}
        showNavigation={false}
        className={className}
      />
    </FormProvider>
  );
}

export default TransferModal;
