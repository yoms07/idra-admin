"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from "./form-provider";
import type { AuthFormValues } from "./form-provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { GoogleIcon } from "@/components/icons/google";

export function LoginForm() {
  const form = useFormContext<AuthFormValues>();
  const { submitLogin, loading, switchTo } = useAuth();

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
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          leftElement={<Lock className="size-4" />}
          value={form.watch("password")}
          onChange={(e) => form.setValue("password", e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <Checkbox
            id="remember"
            checked={form.watch("remember")}
            onCheckedChange={(v) => form.setValue("remember", Boolean(v))}
          />
          <span>Remember for 30 days</span>
        </label>
        <button
          onClick={() => switchTo("forgot-password")}
          className="text-sm text-tertiary font-semibold hover:underline"
        >
          Forgot password
        </button>
      </div>

      <Button className="w-full" disabled={loading} onClick={submitLogin}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
      <Button
        variant="secondary"
        className="w-full shadow-none font-figtree font-semibold flex items-center"
      >
        <GoogleIcon />
        Sign in with Google
      </Button>

      <div className="text-center text-sm text-[#535862]">
        Don&apos;t have an account?{" "}
        <button
          className="text-tertiary font-semibold hover:underline"
          onClick={() => switchTo("register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
