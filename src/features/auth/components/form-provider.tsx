"use client";

import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";

export type AuthStep = "login" | "register" | "otp" | "forgot-password";

export type AuthFormValues = {
  email: string;
  password: string;
  remember: boolean;
  name?: string;
  confirmPassword?: string;
  otp?: string;
};

type AuthContextValue = {
  step: AuthStep;
  loading: boolean;
  switchTo: (s: AuthStep) => void;
  submitLogin: () => Promise<void>;
  submitRegister: () => Promise<void>;
  verifyOtp: () => Promise<void>;
  submitForgotPassword: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = React.useState<AuthStep>("login");
  const [loading, setLoading] = React.useState(false);
  const form = useForm<AuthFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
      name: "",
      confirmPassword: "",
      otp: "",
    },
    mode: "onChange",
  });

  const switchTo = (target: AuthStep) => {
    setStep(target);
    setLoading(false);
    form.setValue("otp", "");
  };

  const submitLogin = async () => {
    const valid = await form.trigger(["email", "password"]);
    if (!valid) return;
    setLoading(true);
    // TODO: call login API
    await new Promise((r) => setTimeout(r, 500));
    setStep("otp");
    setLoading(false);
  };

  const submitRegister = async () => {
    const valid = await form.trigger([
      "name",
      "email",
      "password",
      "confirmPassword",
    ]);
    if (!valid) return;
    const v = form.getValues();
    if (v.password !== v.confirmPassword) {
      form.setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }
    setLoading(true);
    // TODO: call register API
    await new Promise((r) => setTimeout(r, 700));
    setStep("otp");
    setLoading(false);
  };

  const verifyOtp = async () => {
    const valid = await form.trigger("otp");
    if (!valid) return;
    setLoading(true);
    // TODO: verify OTP
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
  };

  const submitForgotPassword = async () => {
    const valid = await form.trigger("email");
    if (!valid) return;
    setLoading(true);
    // TODO: call forgot password API
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    // TODO: show success message or redirect to OTP step
  };

  const value: AuthContextValue = {
    step,
    loading,
    switchTo,
    submitLogin,
    submitRegister,
    verifyOtp,
    submitForgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      <FormProvider {...form}>{children}</FormProvider>
    </AuthContext.Provider>
  );
}
