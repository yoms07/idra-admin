"use client";

import * as React from "react";
import { IDRALogo } from "@/components/icons/idra-logo";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { RequireNotAuthenticated } from "@/features/auth/components/auth-wrapper";

export default function ResetPasswordPage() {
  return (
    <RequireNotAuthenticated>
      <main
        className="h-screen w-full"
        style={{
          background: "url('/images/login-bg.png') no-repeat center center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto grid grid-cols-1 gap-8 h-full">
          <div className="flex flex-col gap-6 rounded-xl py-0 md:py-6 justify-center max-w-md w-full mx-auto min-h-screen md:h-auto">
            <div className="px-2 py-4 bg-white rounded-lg">
              <div className="flex flex-col items-center">
                <IDRALogo />
                <h2 className="text-4xl leading-none font-semibold text-center mt-4">
                  Reset Password
                </h2>
                <p className="text-[#535862] text-center mt-2 text-md font-light">
                  Enter your new password below.
                </p>
              </div>
              <ResetPasswordForm />
            </div>
          </div>
        </div>
      </main>
    </RequireNotAuthenticated>
  );
}
