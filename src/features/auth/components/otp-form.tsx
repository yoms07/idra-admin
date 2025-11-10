"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import OtpInput from "react-otp-input";
import { useAuth } from "./form-provider";
import type { AuthFormValues } from "./form-provider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function OtpForm() {
  const form = useFormContext<AuthFormValues>();
  const { verifyOtp, loading, switchTo } = useAuth();
  const email = form.watch("email");
  const otpValue = form.watch("otp") ?? "";
  const errors = form.formState.errors;

  return (
    <div className="px-6 space-y-5">
      {errors.root && (
        <div className="text-red-600 text-sm p-2 border border-red-200 bg-red-50 rounded">
          {errors.root.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="otp">One-Time Password</Label>
        <OtpInput
          value={otpValue}
          onChange={(value) => form.setValue("otp", value)}
          numInputs={6}
          renderInput={(props) => (
            <input
              {...props}
              className="!size-12 border border-input bg-background text-center text-sm shadow-xs transition-all outline-none rounded-md focus:border-ring focus:ring-ring/50 focus:ring-[3px] focus:z-10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
          renderSeparator={() => <div className="w-4">•</div>}
          containerStyle={{
            display: "flex",
            gap: "0.5rem",
            margin: "24px 0",
            justifyContent: "center",
          }}
          inputType="text"
        />
        <div className="text-xs text-muted-foreground">
          We sent a code to {email || "your email"}.
        </div>
        {errors.otp && (
          <p className="text-red-600 text-sm">{errors.otp.message}</p>
        )}
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
