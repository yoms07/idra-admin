"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { DepositFormValues } from "../../deposit-modal";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";
import { useWalletAddresses } from "@/features/user";
import { Loader } from "@/components/common/Loader";
import { Copy } from "lucide-react";
import DashboardSelect from "@/components/dashboard/select";
import { SelectItem } from "@/components/ui/select";

export function WalletDepositStep() {
  const form = useFormContext<DepositFormValues>();
  const { close } = useMultiStepModal();
  const { data: walletAddresses, isLoading } = useWalletAddresses();

  const address = walletAddresses?.evmAddress ?? undefined;

  const formatAddress = (addr: string): string => {
    if (!addr || addr.length <= 10) return addr;
    const start = addr.slice(0, 9);
    const end = addr.slice(-20);
    return `${start}....${end}`;
  };

  React.useEffect(() => {
    if (walletAddresses?.evmAddress) {
      form.setValue("network", "ethereum", { shouldDirty: true });
      form.setValue("walletAddress", walletAddresses.evmAddress, {
        shouldDirty: true,
      });
    }
  }, [walletAddresses, form]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (!walletAddresses) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Unable to load wallet addresses
      </div>
    );
  }

  return (
    <Form {...(form as any)}>
      <div className="space-y-6">
        <DashboardSelect label="Method" value="EVM" placeholder="Network">
          <SelectItem key={"evm"} value="EVM">
            <span className="flex items-center gap-2">
              <span>EVM</span>
            </span>
          </SelectItem>
        </DashboardSelect>
        {address && (
          <div className="p-4 !bg-[#F1F5F9] rounded-xl font-figtree">
            <div className="flex items-center justify-center">
              <img
                alt="Wallet Address QR"
                className="border rounded-md p-2 bg-white"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`}
                width={200}
                height={200}
              />
            </div>
            <p className="mt-4 text-[#64748B]">Wallet Address</p>

            <div className="flex items-center justify-between gap-2">
              <div className="font-mono text-sm break-all">
                {formatAddress(address)}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shadow-none"
                onClick={async () => {
                  await navigator.clipboard.writeText(address);
                }}
              >
                <Copy
                  onClick={async () => {
                    await navigator.clipboard.writeText(address);
                  }}
                />
              </Button>
            </div>
          </div>
        )}
        <Button className="w-full" onClick={close}>
          Finished
        </Button>
      </div>
    </Form>
  );
}
