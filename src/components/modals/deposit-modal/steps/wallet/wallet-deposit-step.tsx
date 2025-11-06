"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { SelectItem } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import DashboardSelect from "@/components/dashboard/select";
import type { DepositFormValues, Network } from "../../deposit-modal";
import { useMultiStepModal } from "@/components/modals/multi-step-modal";

const networkToAddress: Record<Network, string> = {
  ethereum: "0xAbCdEf1234567890aBCdEf1234567890aBCdEf12",
  polygon: "0x1111222233334444555566667777888899990000",
  solana: "3YHh2bPqL4jGv7Wc9f1g2h3j4k5l6m7n8o9p0q1r2s",
};

export function WalletDepositStep() {
  const form = useFormContext<DepositFormValues>();
  const { close } = useMultiStepModal();
  const network = form.watch("network");

  const address = React.useMemo(() => {
    return network ? networkToAddress[network] : undefined;
  }, [network]);

  React.useEffect(() => {
    if (address) {
      form.setValue("walletAddress", address, { shouldDirty: true });
    }
  }, [address, form]);

  return (
    <Form {...(form as any)}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="network"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DashboardSelect
                  label="Network"
                  value={field.value ?? undefined}
                  onValueChange={(v) => field.onChange(v as Network)}
                  placeholder="Select a network"
                >
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                </DashboardSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {address && (
          <Card className="p-4 space-y-3">
            <div className="text-sm text-muted-foreground">
              Deposit Address (receive only):
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Wallet Address QR"
                className="border rounded-md p-2 bg-white"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`}
                width={200}
                height={200}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono text-sm break-all">{address}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(address);
                }}
              >
                Copy
              </Button>
            </div>
          </Card>
        )}
        <Button className="w-full" onClick={close}>
          Finished
        </Button>
      </div>
    </Form>
  );
}
