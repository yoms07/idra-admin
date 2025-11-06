"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { TransferFormValues } from "../transfer-modal";
import { Building2, Link as LinkIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChooseDestinationStep() {
  const { setValue, watch } = useFormContext<TransferFormValues>();
  const current = watch("destination");

  const choose = (dest: NonNullable<TransferFormValues["destination"]>) => {
    setValue("destination", dest, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="space-y-6 font-manrope">
      <div className="grid grid-cols-1 gap-4">
        <div
          role="button"
          onClick={() => choose("bank")}
          className={cn(
            "p-4 flex items-center gap-4 border-1 transition-colors cursor-pointer rounded-lg",
            current === "bank"
              ? "border-primary-600"
              : "border-[#E2E8F0] hover:border-primary-600"
          )}
        >
          <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-12">
            <Building2 className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">Withdraw to bank</div>
            <div className="text-sm text-muted-foreground truncate">
              Initiate a funds transfer to a bank account
            </div>
          </div>
          <ChevronRight className="text-muted-foreground" />
        </div>

        <div
          role="button"
          onClick={() => choose("onchain")}
          className={cn(
            "p-4 flex items-center gap-4 border-1 transition-colors cursor-pointer rounded-lg",
            current === "onchain"
              ? "border-primary-600"
              : "border-[#E2E8F0] hover:border-primary-600"
          )}
        >
          <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-12">
            <LinkIcon className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">Send on-chain</div>
            <div className="text-sm text-muted-foreground truncate">
              Transfer funds to a blockchain address
            </div>
          </div>
          <ChevronRight className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
