"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type DashboardSelectProps = {
  label: string;
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  display?: React.ReactNode; // custom selected display (e.g., logo + text)
  className?: string;
  children?: React.ReactNode; // SelectItem list
};

/**
 * Large, soft select trigger styled like the design (light background, rounded, label on the left).
 * Compose with shadcn SelectItem inside children.
 */
export function DashboardSelect({
  label,
  value,
  onValueChange,
  placeholder = "Select",
  display,
  className,
  children,
}: DashboardSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "!bg-[#F1F5F9] rounded-xl px-4 !h-12 w-full border-none",
          "justify-between items-center",
          "focus:ring-0 focus:border-transparent",
          className
        )}
      >
        <div className="flex items-center gap-4 w-full">
          <span className="text-[#64748B] text-sm">{label}</span>
          <div className="text-[#0F172A] text-sm leading-none font-medium min-w-0 truncate">
            {display ?? <SelectValue placeholder={placeholder} />}
          </div>
        </div>
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

export default DashboardSelect;
