"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "./form-provider";
import type { AuthFormValues } from "./form-provider";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

export function OtpForm() {
  const form = useFormContext<AuthFormValues>();
  const { verifyOtp, loading, switchTo } = useAuth();
  const email = form.watch("email");
  const otpValue = form.watch("otp") ?? "";

  return (
    <div className="px-6 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="otp">One-Time Password</Label>
        <InputOTP
          maxLength={6}
          value={otpValue}
          onChange={(value) => form.setValue("otp", value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="text-xs text-muted-foreground">
          We sent a code to {email || "your email"}.
        </div>
      </div>
      <Button className="w-full" disabled={loading} onClick={verifyOtp}>
        {loading ? "Verifying..." : "Verify"}
      </Button>
      <div className="text-center text-sm text-[#535862]">
        Entered wrong email?{" "}
        <button
          className="text-tertiary font-semibold hover:underline"
          onClick={() => switchTo("login")}
        >
          Back to login
        </button>
      </div>
    </div>
  );
}

export default OtpForm;
