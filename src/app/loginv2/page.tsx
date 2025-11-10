"use client";
import * as React from "react";
import { IDRALogo } from "@/components/icons/idra-logo";
import { GoogleIcon } from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import {
  AuthProvider,
  useAuth,
} from "@/features/auth/components/form-provider";
import LoginForm from "@/features/auth/components/login-form";
import RegisterForm from "@/features/auth/components/register-form";
import OtpForm from "@/features/auth/components/otp-form";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import { RequireNotAuthenticated } from "@/features/auth/components/auth-wrapper";

function AuthBody() {
  const { step } = useAuth();
  const title =
    step === "login"
      ? "Welcome back"
      : step === "register"
        ? "Create account"
        : step === "forgot-password"
          ? "Reset password"
          : "Verify your email";
  const subtitle =
    step === "login"
      ? "Welcome back! Please enter your details."
      : step === "register"
        ? "Please fill your details to create an account."
        : step === "forgot-password"
          ? "Enter your email address and we'll send you a link to reset your password."
          : "Enter the 6-digit code we sent to your email.";

  return (
    <main className="min-h-screen h-screen w-full p-6 md:p-10">
      <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 h-full">
        {/* Left: Auth Panel */}
        <div className="flex flex-col gap-6 rounded-xl py-6 justify-center max-w-xl w-full mx-auto">
          <div className="px-6 flex flex-col items-center">
            <IDRALogo />
            <h2 className="text-4xl leading-none font-semibold text-center mt-4">
              {title}
            </h2>
            <p className="text-[#535862] text-center mt-2 text-md font-light">
              {subtitle}
            </p>
          </div>
          <div className="px-6 space-y-5">
            {step === "login" && <LoginForm />}
            {step === "register" && <RegisterForm />}
            {step === "otp" && <OtpForm />}
            {step === "forgot-password" && <ForgotPasswordForm />}
          </div>
        </div>

        <div className="rounded-2xl border overflow-hidden bg-muted/40 w-full h-full min-h-0">
          <div className="grid h-full w-full place-items-center p-3">
            <img
              src="/images/login-page.png"
              alt="Login Page"
              className="h-full w-auto max-w-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <RequireNotAuthenticated>
      <AuthProvider>
        <AuthBody />
      </AuthProvider>
    </RequireNotAuthenticated>
  );
}
