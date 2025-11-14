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
  // Format number with thousand separators
  const formatWithSeparator = (num: number): string => {
    if (num === null || num === undefined) return "";
    return num.toLocaleString("en-US", {
      maximumFractionDigits: 0,
      useGrouping: true,
    });
  };

  // Remove separators and parse to number
  const parseInputValue = (input: string): number | null => {
    const cleaned = input.replace(/,/g, "");
    if (cleaned === "") return null;
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : null;
  };

  const display = formatWithSeparator(Number(value));

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
            const inputValue = e.target.value;
            const parsed = parseInputValue(inputValue);
            onChange(parsed);
          }}
          placeholder="0"
          disabled={disabled}
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
