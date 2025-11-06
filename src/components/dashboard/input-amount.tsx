"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import AutosizeInput from "react-input-autosize";

export type InputAmountProps = {
  value: number | string | null | undefined;
  onChange: (value: number | null) => void;
  label?: string;
  currency?: string;
  className?: string;
  disabled?: boolean;
};

export function InputAmount({
  value,
  onChange,
  label = "Amount",
  currency = "IDR",
  className,
  disabled,
}: InputAmountProps) {
  const display =
    value === null || value === undefined || value === "" ? "" : String(value);

  return (
    <div
      className={cn(
        "bg-[#F1F5F9] rounded-xl px-4 py-3",
        "border border-transparent",
        className
      )}
    >
      <div className="text-[#64748B] text-sm mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <AutosizeInput
          value={display}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            if (v === "") return onChange(null);
            const num = Number(v);
            onChange(Number.isFinite(num) ? num : null);
          }}
          placeholder="0"
          inputClassName={cn(
            "bg-transparent outline-none min-w-16",
            "text-3xl leading-none tracking-tight text-foreground",
            "placeholder:text-muted-foreground"
          )}
        />
        <span className="text-[#111827] text-base whitespace-nowrap">
          {currency}
        </span>
      </div>
    </div>
  );
}

export default InputAmount;
