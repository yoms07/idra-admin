"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { DepositFormValues } from "../deposit-modal";
import { Building2, Link as LinkIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChooseSourceStep() {
  const { setValue, watch } = useFormContext<DepositFormValues>();
  const current = watch("source");

  const choose = (source: NonNullable<DepositFormValues["source"]>) => {
    setValue("source", source, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="space-y-6 font-manrope">
      <div className="grid grid-cols-1 gap-4">
        <div
          role="button"
          onClick={() => choose("funds")}
          className={cn(
            "p-4 flex items-center gap-4 border-1 transition-colors cursor-pointer rounded-lg",
            current === "funds"
              ? "border-primary-600"
              : "border-[#E2E8F0] hover:border-primary-600"
          )}
        >
          <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-12">
            <Building2 className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">Funds Deposit</div>
            <div className="text-sm text-muted-foreground truncate">
              Initiate a funds transfer from your bank account
            </div>
          </div>
          <ChevronRight className="text-muted-foreground" />
        </div>

        <div
          role="button"
          onClick={() => choose("wallet")}
          className={cn(
            "p-4 flex items-center gap-4 border-1 transition-colors cursor-pointer rounded-lg",
            current === "wallet"
              ? "border-primary-600"
              : "border-[#E2E8F0] hover:border-primary-600"
          )}
        >
          <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary size-12">
            <LinkIcon className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">On-chain Deposit</div>
            <div className="text-sm text-muted-foreground truncate">
              Transfer funds from a blockchain wallet
            </div>
          </div>
          <ChevronRight className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
