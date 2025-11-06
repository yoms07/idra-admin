"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputTextProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

// Large soft text input with a left label (e.g., "To")
export function InputText({
  label,
  value,
  onChange,
  placeholder = "",
  className,
  disabled,
}: InputTextProps) {
  return (
    <div
      className={cn(
        "bg-[#F1F5F9] rounded-xl px-4 py-3",
        "border border-transparent",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <span className="text-[#64748B] text-sm shrink-0">{label}</span>
        <input
          type="text"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "bg-transparent outline-none w-full",
            "text-sm leading-none tracking-tight text-foreground",
            "placeholder:text-muted-foreground"
          )}
        />
      </div>
    </div>
  );
}

export default InputText;
