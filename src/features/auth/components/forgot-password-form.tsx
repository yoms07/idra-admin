"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "./form-provider";
import type { AuthFormValues } from "./form-provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function ForgotPasswordForm() {
  const form = useFormContext<AuthFormValues>();
  const { submitForgotPassword, loading, switchTo } = useAuth();

  return (
    <div className="px-6 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          leftElement={<Mail className="size-4" />}
          value={form.watch("email")}
          onChange={(e) => form.setValue("email", e.target.value)}
        />
        <div className="text-xs text-muted-foreground">
          We&apos;ll send you a link to reset your password.
        </div>
      </div>

      <Button
        className="w-full"
        disabled={loading}
        onClick={submitForgotPassword}
      >
        {loading ? "Sending..." : "Send reset link"}
      </Button>

      <div className="text-center text-sm text-[#535862]">
        Remember your password?{" "}
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

export default ForgotPasswordForm;
