"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import OtpInput from "react-otp-input";
import { useAuth } from "./form-provider";
import type { AuthFormValues } from "./form-provider";
import { Button } from "@/components/ui/button";

export function OtpForm() {
  const form = useFormContext<AuthFormValues>();
  const { verifyOtp, loading, switchTo } = useAuth();
  const otpValue = form.watch("otp") ?? "";
  const errors = form.formState.errors;
  const [hasAutoVerified, setHasAutoVerified] = React.useState(false);

  React.useEffect(() => {
    if (otpValue.length === 6 && !loading && !hasAutoVerified) {
      setHasAutoVerified(true);
      verifyOtp();
    }
    if (otpValue.length < 6) {
      setHasAutoVerified(false);
    }
  }, [otpValue, loading, hasAutoVerified, verifyOtp]);

  return (
    <div className="px-6 space-y-5">
      {errors.root && (
        <div className="text-red-600 text-sm p-2 border border-red-200 bg-red-50 rounded">
          {errors.root.message}
        </div>
      )}

      <div className="space-y-2">
        <OtpInput
          value={otpValue}
          onChange={(value) => form.setValue("otp", value)}
          numInputs={6}
          renderInput={(props) => (
            <input
              {...props}
              className="!size-14 border border-[#A3A3A3] text-center text-sm transition-all outline-none rounded-lg focus:border-ring focus:ring-ring/50 focus:ring-[3px] focus:z-10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
          containerStyle={{
            display: "flex",
            gap: "0.5rem",
            margin: "24px 0",
            justifyContent: "center",
          }}
          inputType="text"
        />

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
