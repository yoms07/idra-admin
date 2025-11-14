"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import {
  useResetPassword,
  useVerifyResetToken,
} from "@/features/auth/hooks/authHook";
import { toast } from "sonner";
import { Loader } from "@/components/common/Loader";

const ResetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { data: tokenData, isLoading: isVerifyingToken } = useVerifyResetToken(
    token || undefined
  );
  const resetPasswordMutation = useResetPassword();

  const isTokenValid = tokenData?.valid ?? false;
  const userEmail = tokenData?.email;

  React.useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link. No token provided.");
      return;
    }

    if (!isVerifyingToken && !isTokenValid) {
      toast.error("Invalid or expired reset link. Please request a new one.");
    }
  }, [token, isVerifyingToken, isTokenValid]);

  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    if (!token) return;

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        newPassword: data.newPassword,
      });
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      toast.error("Failed to reset password. The link may have expired.");
    }
  };

  if (isVerifyingToken) {
    return (
      <div className="px-6 py-8 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!token || !isTokenValid) {
    return (
      <div className="px-6 space-y-5">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-[#111827]">
            Invalid Reset Link
          </h3>
          <p className="text-sm text-[#4B5563]">
            The password reset link is invalid or has expired. Please request a
            new password reset link.
          </p>
          <Button className="w-full" onClick={() => router.push("/login")}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 space-y-5">
      <div className="space-y-2 mt-4">
        <Label htmlFor="newPassword">New Password</Label>
        <PasswordInput
          id="newPassword"
          placeholder="Enter new password"
          autoComplete="new-password"
          leftElement={<Lock className="size-4" />}
          {...form.register("newPassword")}
        />
        {form.formState.errors.newPassword && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm new password"
          autoComplete="new-password"
          leftElement={<Lock className="size-4" />}
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={resetPasswordMutation.isPending}
      >
        {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
      </Button>

      <div className="text-center text-sm text-[#535862]">
        Remember your password?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-tertiary font-semibold hover:underline"
        >
          Back to Login
        </button>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
