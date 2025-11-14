"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  MultiStepModal,
  type MultiStep,
} from "@/components/modals/multi-step-modal";
import { Button } from "@/components/ui/button";

import { ChooseSourceStep } from "./steps/choose-source-step";
import { ChoosePaymentMethodStep } from "./steps/funds/choose-payment-method-step";
import { PaymentSummaryStep } from "./steps/funds/payment-summary-step";
import { SuccessStep } from "./steps/funds/success-step";
import { WalletDepositStep } from "./steps/wallet/wallet-deposit-step";
import type { DepositData } from "@/features/deposit";

export type DepositSource = "funds" | "wallet";
export type Network = "ethereum" | "solana" | "polygon";

export type DepositFormValues = {
  source: DepositSource | null;
  paymentMethod: string | null;
  amount: number | null;
  depositId?: string | null;
  depositData?: DepositData | null;
  vaNumber?: string | null;
  qrisPayload?: string | null;
  // wallet flow
  network: Network | null;
  walletAddress?: string | null;
};

export type DepositModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

export function DepositModal({
  open,
  onOpenChange,
  className,
}: DepositModalProps) {
  const [instance, setInstance] = React.useState(0);
  const form = useForm<DepositFormValues>({
    defaultValues: {
      source: null,
      paymentMethod: null,
      amount: null,
      depositId: null,
      depositData: null,
      vaNumber: null,
      qrisPayload: null,
      network: null,
      walletAddress: null,
    },
    mode: "onChange",
  });

  const source = form.watch("source");

  React.useEffect(() => {
    if (open) {
      // Remount modal content on each open to reset internal step index
      setInstance((n) => n + 1);
    }
  }, [open]);

  // Build steps dynamically based on chosen source
  const steps = React.useMemo<MultiStep[]>(() => {
    const sourceStep: MultiStep = {
      id: "source",
      title: "What type of deposit are you making today?",
      content: <ChooseSourceStep />,
      renderFooter: ({ goNext }) => {
        const canProceed = !!form.watch("source");
        return (
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              variant="outline-secondary"
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
    if (source === "funds") {
      return [
        sourceStep,
        {
          id: "funds-method",
          title: "Choose payment method",
          content: <ChoosePaymentMethodStep />,
        },
        {
          id: "funds-summary",
          title: "Payment summary",
          content: <PaymentSummaryStep />,
        },
        {
          id: "funds-success",
          content: <SuccessStep />,
          renderFooter: () => null,
          footer: null,
          showProgressBar: false,
          title: <h1 className="border-b pb-1">Transfered Details</h1>,
        },
      ];
    }
    if (source === "wallet") {
      return [
        sourceStep,
        {
          id: "wallet",
          title: "Deposit via blockchain wallet",
          content: <WalletDepositStep />,
        },
      ];
    }
    // initial state: only the first step visible
    return [sourceStep];
  }, [source]);

  return (
    <FormProvider {...form}>
      <MultiStepModal
        showProgressStep={false}
        key={`deposit-${instance}`}
        open={open}
        onOpenChange={(o) => {
          if (!o) {
            form.reset();
          }
          onOpenChange(o);
        }}
        steps={steps}
        showNavigation={false}
        className={className}
      />
    </FormProvider>
  );
}

export default DepositModal;
