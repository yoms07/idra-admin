"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "./form-provider";
import type { AuthFormValues } from "./form-provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";

export function RegisterForm() {
  const form = useFormContext<AuthFormValues>();
  const { submitRegister, loading, switchTo } = useAuth();
  const errors = form.formState.errors;

  return (
    <div className="px-6 space-y-5">
      {errors.root && (
        <div className="text-red-600 text-sm p-2 border border-red-200 bg-red-50 rounded">
          {errors.root.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          leftElement={<User className="size-4" />}
          value={form.watch("name") ?? ""}
          onChange={(e) => form.setValue("name", e.target.value)}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>
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
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="new-password"
          leftElement={<Lock className="size-4" />}
          value={form.watch("password")}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            form.setValue("password", e.target.value)
          }
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <PasswordInput
          id="confirm"
          placeholder="••••••••"
          autoComplete="new-password"
          leftElement={<Lock className="size-4" />}
          value={form.watch("confirmPassword") ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            form.setValue("confirmPassword", e.target.value)
          }
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button className="w-full" disabled={loading} onClick={submitRegister}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
      <div className="text-center text-sm text-[#535862]">
        Already have an account?{" "}
        <button
          className="text-tertiary font-semibold hover:underline"
          onClick={() => switchTo("login")}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
