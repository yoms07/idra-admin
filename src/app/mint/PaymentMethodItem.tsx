"use client";

import { RadioGroupItem } from "@/components/ui/radio-group";
import * as React from "react";

interface PaymentMethodItemProps {
  value: "qris" | "va_bri" | "va_bca" | "va_bni";
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function PaymentMethodItem({
  value,
  title,
  description,
  icon,
}: PaymentMethodItemProps) {
  return (
    <label className="cursor-pointer w-full h-full">
      <RadioGroupItem value={value} id={value} className="sr-only peer" />
      <div className="flex items-start gap-3 rounded-lg border p-3 transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
        <div className="mt-0.5">{icon}</div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
    </label>
  );
}
